const User = require('../models/admin-model');
const bcrypt = require('bcryptjs');

exports.adminHome = async (req, res) => {

    try {

        res.render('home', {
            user: req.user
        });

    } catch (err) {

        console.log(err);

    }

};

exports.loginPage = (req, res) => {
    res.render('login');
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.redirect('/login?error=No+account+found+with+that+email');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.redirect('/login?error=Incorrect+password%2C+please+try+again');
        }

        res.cookie('userId', user._id, {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 24
        });

        res.redirect('/?success=Welcome+back%2C+' + user.fname + '!');
    } catch (err) {
        console.log(err);
        res.redirect('/login?error=Something+went+wrong%2C+please+try+again');
    }

};

exports.registerPage = (req, res) => {
    res.render('register');
};

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const checkEmail = await User.findOne({ email });

        if (checkEmail) {
            return res.redirect('/register?error=That+email+is+already+registered');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fname: username,
            lname: 'User',
            email,
            password: hashedPassword,
            phone: '0000000000',
            dob: '2000-01-01',
            role: 'Admin',
            city: 'Unknown',
            gender: 'Other'
        });

        await newUser.save();
        res.redirect('/login?success=Account+created!+Please+sign+in');
    } catch (err) {
        console.log(err);
        res.redirect('/register?error=Registration+failed%2C+please+try+again');
    }

};

exports.logoutUser = (req, res) => {

    res.clearCookie('userId');

    res.redirect('/login');

};

exports.adminAddUser = async (req, res) => {

    if (req.method === 'POST') {

        try {

            const {
                fname,
                lname,
                email,
                password,
                phone,
                dob,
                role,
                city,
                gender
            } = req.body;

            const checkEmail = await User.findOne({ email });

            if (checkEmail) {
                return res.redirect('/add-user?error=A+user+with+that+email+already+exists');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const avatar = req.file
                ? '/uploads/' + req.file.filename
                : '';

            const newUser = new User({
                fname,
                lname,
                email,
                password: hashedPassword,
                phone,
                dob,
                role,
                city,
                gender,
                avatar
            });

            await newUser.save();
            res.redirect('/view-user?success=User+added+successfully');

        } catch (err) {

            console.log(err);
            res.redirect('/add-user?error=Failed+to+add+user%2C+please+try+again');

        }

    } else {

        res.render('addUser', {
            user: req.user
        });

    }
};

exports.adminViewUser = async (req, res) => {

    try {

        const users = await User.find({ isDeleted: false });

        res.render('viewUser', {
            users,
            user: req.user
        });

    } catch (err) {

        console.log(err);

    }

};

exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        await User.findByIdAndUpdate(id, { isDeleted: true });
        res.redirect('/view-user');
    } catch (err) {
        console.log(err);
    }
};

exports.viewTrashUser = async (req, res) => {
    try {
        const users = await User.find({ isDeleted: true });
        res.render('trashUser', {
            users,
            user: req.user
        });
    } catch (err) {
        console.log(err);
    }
};

exports.restoreUser = async (req, res) => {
    try {
        const id = req.params.id;
        await User.findByIdAndUpdate(id, { isDeleted: false });
        res.redirect('/trash-user');
    } catch (err) {
        console.log(err);
    }
};

exports.permanentDeleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        await User.findByIdAndDelete(id);
        res.redirect('/trash-user');
    } catch (err) {
        console.log(err);
    }
};

exports.editUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);

        res.render('editUser', { user });
    } catch (err) {
        console.log(err);
    }
};

exports.updateUser = async (req, res) => {

    try {

        const id = req.params.id;

        const {
            fname,
            lname,
            email,
            password,
            phone,
            dob,
            role,
            city,
            gender
        } = req.body;

        let updateData = {
            fname,
            lname,
            email,
            phone,
            dob,
            role,
            city,
            gender
        };

        if (password && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        if (req.file) {
            updateData.avatar = '/uploads/' + req.file.filename;
        }

        await User.findByIdAndUpdate(id, updateData);
        res.redirect('/view-user?success=User+updated+successfully');
    } catch (err) {
        console.log(err);
        res.redirect('/view-user?error=Failed+to+update+user');
    }
};

exports.profilePage = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.render('profile', { user, currentUser: req.user });
    } catch (err) {
        console.log(err);
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const id = req.user._id;
        const { fname, lname, phone, dob, city, gender } = req.body;

        let updateData = { fname, lname, phone, dob, city, gender };

        if (req.file) {
            updateData.avatar = '/uploads/' + req.file.filename;
        }

        await User.findByIdAndUpdate(id, updateData);
        res.redirect('/profile?success=Profile+updated+successfully');
    } catch (err) {
        console.log(err);
        res.redirect('/profile?error=Failed+to+update+profile');
    }
};

exports.forgetPasswordPage = (req, res) => {
    res.render('forgetPassword');
};

exports.sendForgetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found');
            return res.redirect('/forget-password');
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        user.resetPasswordOtp = otp;
        user.resetPasswordExpires = Date.now() + 600000; // 10 mins
        await user.save();

        const nodemailer = require('nodemailer');
        
        nodemailer.createTestAccount((err, account) => {
            if (err) {
                console.error('Failed to create a testing account. ' + err.message);
                return process.exit(1);
            }

            let transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            });

            let message = {
                from: 'Admin Panel <admin@example.com>',
                to: user.email,
                subject: 'Password Reset OTP',
                text: 'Your OTP is: ' + otp,
                html: '<p>Your OTP is: <b>' + otp + '</b></p>'
            };

            transporter.sendMail(message, (err, info) => {
                if (err) {
                    console.log('Error occurred. ' + err.message);
                    return process.exit(1);
                }
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                
                // Redirect to OTP verification page
                res.redirect('/verify-otp');
            });
        });

    } catch (err) {
        console.log(err);
    }
};

exports.verifyOtpPage = (req, res) => {
    res.render('verifyOtp');
};

exports.verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const user = await User.findOne({ resetPasswordOtp: otp, resetPasswordExpires: { $gt: Date.now() } });
        
        if (!user) {
            console.log('Invalid or expired OTP');
            return res.redirect('/verify-otp');
        }
        
        res.redirect('/reset-password/' + otp);
    } catch (err) {
        console.log(err);
    }
};

exports.resetPasswordPage = async (req, res) => {
    try {
        const otp = req.params.token; // we use the token param for OTP
        const user = await User.findOne({ resetPasswordOtp: otp, resetPasswordExpires: { $gt: Date.now() } });

        if (!user) {
            return res.redirect('/forget-password');
        }

        res.render('resetPassword', { token: otp });
    } catch (err) {
        console.log(err);
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const otp = req.params.token;
        const { password } = req.body;
        
        const user = await User.findOne({ resetPasswordOtp: otp, resetPasswordExpires: { $gt: Date.now() } });

        if (!user) {
            return res.redirect('/forget-password');
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordOtp = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.redirect('/login');
    } catch (err) {
        console.log(err);
    }
};

exports.changePasswordPage = (req, res) => {
    res.render('changePassword', { user: req.user });
};

exports.updateChangePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.redirect('/change-password?error=Current+password+is+incorrect');
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.redirect('/profile?success=Password+changed+successfully');
    } catch (err) {
        console.log(err);
        res.redirect('/change-password?error=Failed+to+change+password');
    }
};
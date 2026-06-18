const express = require('express');
const path = require('path');
const port = 9000;
const app = express();

const connectDB = require('./config/db');

const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cookieParser());

const flash = require('./middleware/flash');
app.use(flash);

connectDB();

app.use(express.static(path.join(__dirname, 'public')));

const adminRoutes = require('./routes/admin-routes');
const categoryRoutes = require('./routes/category-routes');
const subcategoryRoutes = require('./routes/subcategory-routes');
const extracategoryRoutes = require('./routes/extracategory-routes');
const productRoutes = require('./routes/product-routes');

app.use('/', adminRoutes);
app.use('/category', categoryRoutes);
app.use('/subcategory', subcategoryRoutes);
app.use('/extracategory', extracategoryRoutes);
app.use('/product', productRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
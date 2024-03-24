const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
const port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));
app.use(flash());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}))
app.use((req, res, next) => {
    res.locals.flash_messages = req.flash('flash_messages');
    next();
})
app.use(methodOverride('_method'))

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://127.0.0.1:27017/krisan').then(() => console.log('Connect to MongoDB')).catch((err) => console.log(err));

const data = [{
        name: 'Penggorok Daun',
        gejala: ['Daun menguning', 'Bintik putih pada tanaman', 'Adanya alur berliku bekas kotoran berwarna putih'],
        solusi: 'Penggunaan Fungisida: Penggunaan fungisida yang direkomendasikan dapat membantu mengendalikan pertumbuhan jamur penyebab penyakit. Pastikan untuk mengikuti petunjuk pemakaian dengan benar dan menggunakan fungisida yang sesuai untuk jenis penyakit yang dihadapi.',
        maxPoints: 3,
        point: []
    },
    {
        name: 'Thrips',
        gejala: ['Pucuk dan tunas-tunas samping berwarna keperak-perakan', 'Daun menguning', 'Serangan pada daun bagian bawah/seluruh daun'],
        solusi: 'Pengendalian Hama Secara Fisik: Gunakan alat seperti selang air dengan tekanan rendah untuk menyemprotkan air ke tanaman dan menghilangkan thrips secara fisik dari permukaan daun. Gunakan pula alat seperti lembaran warna biru atau kuning yang dilapisi lem untuk menarik thrips dan menangkap mereka.',
        maxPoints: 3,
        point: []
    },
    {
        name: 'Karat Putih',
        gejala: ['Serangan pada daun bagian bawah/seluruh daun', 'Daun kerdil', 'Daun cekung dan rapuh', 'Permukaan daun bagian bawah berbintik coklat'],
        solusi: 'Pemantauan Rutin: Lakukan pemantauan rutin terhadap tanaman untuk mendeteksi tanda-tanda awal infeksi karat putih. Dengan mengidentifikasi infeksi secara dini, Anda dapat mengambil tindakan lebih cepat untuk mengendalikan penyebaran penyakit.',
        maxPoints: 4,
        point: []
    },
    {
        name: 'Layu Fusarium',
        gejala: ['Bercak coklat pada daun', 'Pertumbuhan bagian atas tanaman terhambat atau mati', 'Daun layu dan gugur', 'Layu permanen', 'Tanaman membusuk atau mati'],
        solusi: 'Penggunaan Bibit Sehat: Pastikan bibit yang Anda gunakan untuk menanam krisan bebas dari infeksi Fusarium. Pilih bibit yang sehat dan berkualitas dari sumber yang terpercaya.',
        maxPoints: 5,
        point: []
    },
    {
        name: 'Ulat Tentara',
        gejala: ['Epidermis atau bagian atas daun rusak/transparan', 'Daun menguning', 'Tersisa hanya tulang daun pada tanaman', 'Hama memakan tunas dan bunga'],
        solusi: 'Penggunaan Pestisida: Penggunaan insektisida yang aman dan efektif dapat membantu mengendalikan populasi ulat tentara. Pastikan untuk mengikuti petunjuk penggunaan yang tertera pada label produk.',
        maxPoints: 4,
        point: []
    },
    {
        name: 'Tidak Ada Kecocokan Penyakit/Hama',
        gejala: ['Tidak ditemukan gejala yang spesisfik dengan penyakit yang terdeteksi'],
        solusi: 'Silahkan datangi dokter tanaman terdekat',
        point: []
    }
]

function addPoint(sample) {
    data.map((item) => {
        if (item.name === sample) {
            item.point.push(true);
        }
    })
}

function notFound() {
    const point = data[5].point.length;
    if (point === 0) {
        const tempo = [];
        tempo.push(data[5]);
        return tempo;
    }
}

function p1() {
    const point = data[0].point.length;
    if (point === 3) {
        const tempo = [];
        tempo.push(data[0]);
        return tempo;
    } else {
        return notFound();
    }
}

function p2() {
    const point = data[1].point.length;
    if (point === 3) {
        const tempo = [];
        tempo.push(data[1]);
        return tempo;
    } else {
        return notFound();
    }
}

function p3() {
    const point = data[2].point.length;
    if (point === 4) {
        const tempo = [];
        tempo.push(data[2])
        return tempo;
    } else {
        return notFound();
    }
}

function p4() {
    const point = data[3].point.length;
    if (point === 5) {
        const tempo = [];
        tempo.push(data[3])
        return tempo;
    } else {
        return notFound();
    }
}

function p5() {
    const point = data[4].point.length;
    if (point === 4) {
        const tempo = [];
        tempo.push(data[4])
        return tempo;
    } else {
        return notFound();
    }
}

const hasil = () => {
    let refilters = (samples) => {
        const results = [];
        samples.filter((items) => {
            if (items.point.length >= items.maxPoints) {
                results.push(items);
            }
        })
        return results;
    };

    const filters = data.filter((item) => {
        if (item.point.length >= 3) {
            return item.name;
        }
    });
    if (filters.length === 1) {
        for (const filter of filters) {
            switch (filter.name) {
                case 'Penggorok Daun':
                    return p1();
                    break;
                case 'Thrips':
                    return p2();
                    break;
                case 'Karat Putih':
                    return p3();
                    break;
                case 'Layu Fusarium':
                    return p4();
                    break;
                case 'Ulat Tentara':
                    return p5();
                    break;
            }
        }
    } else if (filters.length > 1) {
        return refilters(filters);
    } else {
        return notFound();
    }
}

const auth = (req, res, next) => {
    if (!req.session.user_id) {
        req.flash('flash_messages', 'Harap login dahulu!');
        res.redirect('/login');
    } else {
        next();
    }
}

const author = (req, res, next) => {
    if (req.session.user_id) {
        res.redirect(`/dashboard`);
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/login', author, (req, res) => {
    res.render('auth/login');
});

app.get('/register', author, (req, res) => {
    res.render('auth/register');
});

app.get('/dashboard', auth, async (req, res) => {
    const user = await User.findById(req.session.user_id);
    res.render('dashboard/index', {
        user,
    });
});

app.post('/register', async (req, res) => {
    const {
        username,
        password,
        confirm
    } = req.body

    async function hashed(pw) {
        const hashPw = await bcrypt.hash(pw, 10);
        return hashPw;
    };
    const resultHash = await hashed(password);

    if (password === confirm) {
        const validator = await User.findOne({
            username
        });
        if (validator) {
            req.flash('flash_messages', 'Username sudah digunakan!');
            res.redirect('/register');
        } else {
            const user = new User({
                username,
                password: resultHash,
            });
            user.save();
            req.session.user_id = user.id;
            req.flash('flash_messages', 'Login berhasil!');
            res.redirect(`dashboard`);
        }
    } else {
        req.flash('flash_messages', 'Konfirmasi password ulang!');
        res.redirect('/register');
    }
});

app.post('/login', async (req, res) => {
    const {
        username,
        password
    } = req.body;

    const user = await User.findOne({
        username
    });

    if (user) {
        async function compareHashed(pw, pwcom) {
            const valid = await bcrypt.compare(pw, pwcom);
            if (valid) {
                req.session.user_id = user.id;
                req.flash('flash_messages', 'Login berhasil!');
                res.redirect(`dashboard`);
            } else {
                req.flash('flash_messages', 'Password salah!');
                res.redirect('/login');
            }
        }
        compareHashed(password, user.password);
    } else {
        req.flash('flash_messages', 'Username salah!');
        res.redirect('/login');
    };
});

app.post('/logout', auth, (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    })
});

app.get('/password', (req, res) => {
    res.render('dashboard/password');
});

app.put('/password', async (req, res) => {
    const user = await User.findById(req.session.user_id);
    const {
        password
    } = req.body;
    const hashPw = await bcrypt.hash(password, 10);
    user.password = hashPw;
    await user.save();
    req.flash('flash_messages', 'Password berhasil diubah!');
    res.redirect('/dashboard');
});

app.put('/delete/penyakit', async (req, res) => {
    const user = await User.findById(req.session.user_id);
    user.penyakit.splice(0, user.penyakit.length);
    await user.save();
    req.flash('flash_messages', 'Riwayat sukses dihapus!');
    res.redirect(`/dashboard`);
})

app.get('/g1', auth, (req, res) => {
    data.map((item) => {
        item.point.length = 0;
    });
    res.render('form/g1');
})

app.post('/g1', auth, (req, res) => {
    const {
        validator
    } = req.body;
    if (validator === 'y') {
        addPoint('Penggorok Daun');
        addPoint('Thrips');
        addPoint('Ulat Tentara');
    }
    res.render('form/g2');
})

app.post('/g2', auth, (req, res) => {
    const {
        validator
    } = req.body;
    if (validator === 'y') {
        addPoint('Penggorok Daun');
    }
    res.render('form/g3');
})

app.post('/g3', auth, (req, res) => {
    const {
        validator
    } = req.body;
    if (validator === 'y') {
        addPoint('Penggorok Daun');
    }
    res.render('form/g4');
})

app.post('/g4', auth, (req, res) => {
    const {
        validator
    } = req.body;
    if (validator === 'y') {
        addPoint('Thrips');
    }
    res.render('form/g5');
})

app.post('/g5', auth, (req, res) => {
    const {
        validator
    } = req.body;
    if (validator === 'y') {
        addPoint('Thrips');
        addPoint('Karat Putih');
    }
    res.render('form/g6');
})

app.post('/g6', auth, (req, res) => {
    const {
        validator
    } = req.body;
    if (validator === 'y') {
        addPoint('Karat Putih');
    }
    res.render('form/g7');
})

app.post('/g7', auth, (req, res) => {
    const {
        validator
    } = req.body;
    if (validator === 'y') {
        addPoint('Karat Putih');
    }
    res.render('form/g8');
})

app.post('/g8', auth, (req, res) => {
    const {
        validator
    } = req.body;
    if (validator === 'y') {
        addPoint('Karat Putih');
    }
    res.render('form/g9');
})

app.post('/g9', auth, (req, res) => {
    const {
        validator
    } = req.body;
    if (validator === 'y') {
        addPoint('Layu Fusarium');
    }
    res.render('form/g10');
})

app.post('/g10', auth, (req, res) => {
    const {
        validator
    } = req.body;
    if (validator === 'y') {
        addPoint('Layu Fusarium');
    }
    res.render('form/g11');
})

app.post('/g11', auth, (req, res) => {
    const {
        validator
    } = req.body;
    if (validator === 'y') {
        addPoint('Layu Fusarium');
    }
    res.render('form/g12');
})

app.post('/g12', auth, (req, res) => {
    const {
        validator
    } = req.body;
    if (validator === 'y') {
        addPoint('Layu Fusarium');
    }
    res.render('form/g13');
})

app.post('/g13', auth, (req, res) => {
    const {
        validator
    } = req.body;
    if (validator === 'y') {
        addPoint('Layu Fusarium');
    }
    res.render('form/g14');
})

app.post('/g14', auth, (req, res) => {
    const {
        validator
    } = req.body;
    if (validator === 'y') {
        addPoint('Ulat Tentara');
    }
    res.render('form/g15');
})

app.post('/g15', auth, (req, res) => {
    const {
        validator
    } = req.body;
    if (validator === 'y') {
        addPoint('Ulat Tentara');
    }
    res.render('form/g16');
})

const getValues = async (values, id) => {
    const user = await User.findById(id);
    for (const value of values) {
        user.penyakit.push(value);
    }
    user.save();
};

app.post('/g16', auth, async (req, res) => {
    const {
        validator
    } = req.body;
    if (validator === 'y') {
        addPoint('Ulat Tentara');
    }
    const results = hasil();
    await getValues(results, req.session.user_id);
    res.redirect('/dashboard');
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})
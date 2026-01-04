const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const MONGO_URL =
	"mongodb+srv://homachups_db_user:kZlzKZ1368tlFfaq@cluster0.wa8v1wl.mongodb.net/eDiary?retryWrites=true&w=majority";
mongoose.connect(MONGO_URL);

// Схема юзера
const UserSchema = new mongoose.Schema(
	{
		location: {
			region: String,
			city: String,
			ed_inst: Number,
		},
	},
	{ strict: false }
);
const User = mongoose.model("User", UserSchema);

const LessonSchema = new mongoose.Schema({}, { strict: false });
const Lesson = mongoose.model("Lesson", LessonSchema);

// 🔹 Регистрация (создание юзера)
app.post("/users", async (req, res) => {
	try {
		const user = new User(req.body);
		const savedUser = await user.save();
		res.json(savedUser);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// 🔹 Получить всех юзеров
app.get("/users", async (req, res) => {
	const users = await User.find();
	res.json(users);
});

app.get("/users/filter", async (req, res) => {
	// console.log("🔍 Запрос:", req.query);

	try {
		const { region, city, ed_inst, role } = req.query;
		const filter = {};

		if (region) filter["location.region"] = region;
		if (city) filter["location.city"] = city;
		if (ed_inst) filter["location.ed_inst"] = Number(ed_inst);
		if (role) filter["role"] = role;

		const users = await User.find(filter);
		res.json(users);
	} catch (err) {
		console.error("Помилка запиту:", err);
		res.status(500).json({ message: "Помилка сервера" });
	}
});

// 🔹 Получить все уроки
app.get("/lessons", async (req, res) => {
	// console.log("🔍 Запрос:", req.query);

	try {
		const { region, city, ed_inst } = req.query;
		const filter = {};

		if (region) filter["location.region"] = region;
		if (city) filter["location.city"] = city;
		if (ed_inst) filter["location.ed_inst"] = Number(ed_inst);

		const lessons = await Lesson.findOne(filter);
		res.json(lessons);
	} catch (err) {
		console.error("Помилка запиту:", err);
		res.status(500).json({ message: "Помилка сервера" });
	}
});

app.put("/lessons/update", async (req, res) => {
	try {
		const { region, city, ed_inst, updateData } = req.body;

		if (!region || !city || !ed_inst) {
			return res.status(400).json({ message: "Недостатньо даних для фільтра" });
		}

		// updateData — це об'єкт із тим, що треба оновити
		// наприклад: { events: "Нові події", lessonsDates: [...], teachers: [...] }
		const updatedLesson = await Lesson.findOneAndUpdate(
			{
				"location.region": region,
				"location.city": city,
				"location.ed_inst": Number(ed_inst),
			},
			{ $set: updateData },
			{ new: true }
		);

		if (!updatedLesson)
			return res.status(404).json({ message: "Запис не знайдено" });

		res.json({
			message: "✅ Дані оновлено успішно",
			updatedLesson,
		});
	} catch (err) {
		console.error("Помилка при оновленні:", err);
		res.status(500).json({ message: "Помилка сервера" });
	}
});

// 🔹 Логин (проверка логина и пароля)
app.post("/login", async (req, res) => {
	try {
		const { login, password } = req.body;
		const user = await User.findOne({ login, password });

		if (!user) {
			return res
				.status(401)
				.json({ message: "Щось пішло не так! Неправильні дані!" });
		}

		const token = jwt.sign({ id: user._id }, "secret_key", { expiresIn: "1h" });
		res.json({ token, user });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Помилка сервера" });
	}
});

mongoose.connection.on("connected", () => {
	console.log("Подключение к MongoDB Atlas установлено ✅");
});

mongoose.connection.on("error", (err) => {
	console.log("Ошибка подключения к MongoDB Atlas:", err);
});

app.listen(PORT, () =>
	console.log(`API работает на http://localhost:${PORT} ✅`)
);

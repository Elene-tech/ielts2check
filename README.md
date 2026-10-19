# Exam Tasks: додатковий модуль (тариф з перевіркою)

7 екзаменаційних завдань IELTS Academic Writing Task 1, по одному на кожен тип: Line graph, Pie charts, Bar chart, Table, Process diagram, Maps, Mixed task.
На кожній сторінці: умова в екзаменаційному форматі, графік(и), опис завдання, короткі поради, кнопка 📚 зі словником. Полів для відповіді й моделей немає: відповідь учень пише на твоїй платформі, перевіряєш ти.

## Що в архіві
```
index.html            службова сторінка з готовими iframe-кодами (відкрий її на Vercel)
tasks/                7 завдань + vocabulary.html (окрема сторінка словника)
assets/               process.png, maps.png (схема процесу й карти кампусу)
shared/               core.css, charts.js (малює графіки), exam.js (сторінка завдання), vocab.js (панель словника)
data/graphs.js        дані всіх графіків
data/tasks.js         умови, описи й поради для 7 завдань
data/vocab.js         об’єднаний словник модулів 1–7 (розділи: тип:назва)
```

## Як розмістити
1. GitHub → новий репозиторій `ielts-exam-tasks` → Upload files → перетягни **вміст** папки (index.html, tasks, shared, data, assets).
2. Vercel → Add New → Project → цей репозиторій → Deploy.
3. Відкрий `https://ТВІЙ-САЙТ.vercel.app/`, впиши адресу з Vercel (не домен Kwiga) і скопіюй код для кожного завдання. Рекомендована висота iframe 1500.

## Як змінити завдання
- Текст умови, опис і поради: `data/tasks.js`.
- Числа графіків: `data/graphs.js` (line, pie, bar, table, mixBar, mixTab).
- Схема процесу й карти: це картинки `assets/process.png` і `assets/maps.png`. Щоб замінити, поклади файл з тією самою назвою.

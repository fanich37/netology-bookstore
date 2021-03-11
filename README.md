# Домашнее задание к занятию «2.5 База данных и хранение данных»

**Правила выполнения домашней работы:**

- Выполняйте домашнее задание в отдельной ветке проекта на гитхабе.
- В поле для сдачи работы прикрепите ссылку на ваш проект в Git.
- Присылать на проверку можно каждую задачу по отдельности или все задачи вместе.
- Во время проверки по частям ваша домашняя работа будет со статусом «На доработке».
- Любые вопросы по решению задач задавайте в Slack.

#### Задание 1

Чтобы в будущем вам было легче работать с **MongoDB**, изучите раздел
документации про использование [**CRUD Operations**](https://docs.mongodb.com/manual/crud/)

#### Задание 2

В файле **README.md** написать следующие запросы для **MongoDB**:

- запрос(ы) для _вставки_ данных минимум о двух книгах в коллекцию **books**
- запрос для _поиска_ полей документов коллекции **books** по полю _title_
- запрос для _редактирования_ полей: _description_ и _authors_ коллекции **books** по _\_id_ записи

\*Каждый документ коллекции **books** должен содержать следующую структуру данных:

```javascript
{
  title: "string",
  description: "string",
  authors: "string"
}
```

#### Запросы

- запросы на добавление записей:

```javascript
const result = await db.collection('books').insertOne({
  title: 'Some book',
  description: 'Some book description',
  authors: 'J. Snow',
});
const result = await db.collection('books').insertOne({
  title: 'Second book',
  description: 'Second book description',
  authors: 'S. John',
});
// or
const result = await db.collection('books').insertMany([
  {
    title: 'Some book',
    description: 'Some book description',
    authors: 'J. Snow',
  },
  {
    title: 'Second book',
    description: 'Second book description',
    authors: 'S. John',
  },
]);
```

- запрос на поиск по полю `title`:

```javascript
const result = await db.collection('books').find({ title: 'Second book' });
// or
const result = await db
  .collection('books')
  .find({ title: { $eq: 'Second book' } });
```

- запрос на изменение `authors` и `description` по `_id` книги:

```javascript
const result = await db
  .collection('books')
  .updateOne(
    { _id: 'some_random_id_generated_by_mongo' },
    { $set: { description: 'New description', authors: 'New author' } }
  );
```

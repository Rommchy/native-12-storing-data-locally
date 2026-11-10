import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabase("dictionary.db"); //replace this initialization with the correct one

export function init() {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS words (
          id INTEGER PRIMARY KEY NOT NULL,
          word TEXT NOT NULL UNIQUE,
          phonetics TEXT,
          audio TEXT,
          partOfSpeech TEXT,
          meaning TEXT,
          dateForgets INTEGER NOT NULL,
          dateTotallyForgets INTEGER NOT NULL,
          forgettingSpan INTEGER NOT NULL,
          status INTEGER NOT NULL DEFAULT 0
    )`,
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS theme (
            id INTEGER PRIMARY KEY NOT NULL,
            isDark BOOLEAN NOT NULL DEFAULT 0
    )`,
    );
  });
}

export function addWord(wordData) {
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT OR IGNORE INTO words
      (word, phonetics, audio, partOfSpeech, meaning, dateForgets, dateTotallyForgets, forgettingSpan, status)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        wordData.word,
        wordData.phonetics ?? null,
        wordData.audio ?? null,
        wordData.partOfSpeech ?? null,
        wordData.meaning ?? null,
        wordData.dateForgets,
        wordData.dateTotallyForgets,
        wordData.forgettingSpan,
        wordData.status ?? 0,
      ],
      undefined,
      (_, error) => console.log(error),
    );
  });
}

export function updateWord(wordData) {
  db.transaction((tx) => {
    tx.executeSql(
      `UPDATE words SET
        phonetics = ?, audio = ?, partOfSpeech = ?, meaning = ?, 
        dateForgets = ?, dateTotallyForgets = ?, forgettingSpan = ?, status = ? 
        WHERE word = ?`,
      [
        wordData.phonetics ?? null,
        wordData.audio ?? null,
        wordData.partOfSpeech ?? null,
        wordData.meaning ?? null,
        wordData.dateForgets,
        wordData.dateTotallyForgets,
        wordData.forgettingSpan,
        wordData.status ?? 0,
        wordData.word,
      ],
      undefined,
      (_, error) => console.log(error),
    );
  });
}

export function deleteWord(word) {
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM words WHERE word = ?",
      [word],
      undefined,
      (_, error) => console.log(error),
    );
  });
}

export function getWords(callback) {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM words",
      undefined,
      (_, { rows: { _array } }) => callback(_array),
      (_, error) => console.log(error),
    );
  });
}

export function getTheme(callback) {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT isDark FROM theme WHERE id = 1",
      undefined,
      (_, { rows }) =>
        callback(rows.length > 0 ? !!rows._array[0].isDark : true),
      (_, error) => console.log(error),
    );
  });
}

export function setTheme(isDark) {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT OR REPLACE INTO theme (id, isDark) VALUES (1, ?)",
      [isDark ? 1 : 0],
      undefined,
      (_, error) => console.log(error),
    );
  });
}

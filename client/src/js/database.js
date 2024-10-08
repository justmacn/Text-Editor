import { openDB } from "idb";

const initdb = async () =>
  // Creates a new database named 'editor' which will be using version 1 of the database.
  openDB("editor", 1, {
    // Adds database schema if it has not already been initialized.
    upgrade(db) {
      if (db.objectStoreNames.contains("editor")) {
        console.log("Database for A.T.E. already exists");
        return;
      }
      // Creates a new object store for the data and gives it a key name of 'id' which increments automatically.
      db.createObjectStore("editor", { keyPath: "id", autoIncrement: true });
      console.log("Database for A.T.E. has been created");
    },
  });

// Exports a function to POST to the database.
export const putDb = async (content) => {
  console.log("Put to the database");

  // Creates a connection to the editor database and version.
  const editorDb = await openDB("editor", 1);

  // Creates a new transaction and specifies the database and data privileges.
  const tx = editorDb.transaction("editor", "readwrite");

  // Opens up the desired object store.
  const store = tx.objectStore("editor");

  // Uses the .put() method on the store and passes in the content.
  const request = store.put({ id: 1, value: content });

  // Gets confirmation of the request.
  const result = await request;

  if (result !== undefined) {
    console.log("Data saved to the database, ID:", result);

    // Fetch the newly inserted data to confirm it was saved correctly.
    const savedData = await store.get(result);
    console.log("Saved data:", savedData.value);
    return savedData.value;
  } else {
    console.log(
      "The cat ran away with the note! It wasn't saved to the database!"
    );
    return null;
  }
};

// Exports a function to get the database.
export const getDb = async () => {
  console.log("Get all notes from the database");

  // Creates a connection to the editor database and version.
  const editorDb = await openDB("editor", 1);

  // Creates a new transaction and specifies the database and data privileges.
  const tx = editorDb.transaction("editor", "readonly");

  // Opens up the desired object store.
  const store = tx.objectStore("editor");

  // Uses the .get(1) method to retrieve the value of the first record matching the query.

  const request = store.get(1);

  // Gets confirmation of the request.
  const result = await request;
  result
    ? console.log("Notes retrieved from database:", result.value)
    : console.log("No notes found in database! The cat must have stolen them!");
  return result?.value;
};

export const deleteDb = async () => {
  console.log("Uh oh! The cat ran away with your notes!");
  const editorDb = await openDB("editor", 1);
  const tx = editorDb.transaction("editor", "readwrite");
  const store = tx.objectStore("editor");
  const request = store.delete(1);
  await request;

  console.log("Note has been removed from the database");
  return true;
};

// Starts database
initdb();

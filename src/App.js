import './App.css';
import db, { provider, auth } from './firebase';
import React, { useState, useEffect } from 'react';

function App() {
  const [fields, setFieldValue] = useState({
    subject: '',
    content: '',
  });

  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user)
    })
  })

  useEffect(() => {
    if (!user) {
      return;
    }
    const fetchItems = async () => {
      const result = await db
        .collection('items')
        .where("userId", '==', user.uid).get();

      const parsedResult = result.docs.map((item) => ({
        ...item.data(),
        id: item.id
      }));
      console.log(parsedResult)
      setItems(parsedResult);
      ;
    }
    fetchItems();
  }, []);

  const handleInputChange = (e) => {
    setFieldValue({ ...fields, [e.target.name]: e.target.value });
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const request = {
      ...fields,
      userId: user.uid,
    }

    const result = await db.collection('items').add(fields);

    console.log(result)

    setItems([...items, { ...fields, id: result.id }]);
  };

  const handleDeleteItem = async (id) => {
    await db.collection('items').doc(id).delete();
    const filteredItems = items.filter(item => item.id !== id);

    setItems(filteredItems)
  };


  const login = async () => {
    auth.signInWithRedirect(provider);
  }

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    setItems([]);
  }

  return (
    <div className="App">
      <header>
        <h1>React Firebase</h1>
        {user && <img src={user.photoURL} />}
        {user ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <button onClick={login}>Sign in</button>
        )
        }
      </header>
      <main>
        <section>
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              name="subject"
              value={fields.subject}
              onChange={handleInputChange} />
            <input
              type="text"
              name="content"
              value={fields.content}
              onChange={handleInputChange} />
            <button type='submit'>Add</button>
          </form>
          <section>
            {items.map((item) => {
              return <div key={item.id}>
                <strong>{item.subject}</strong>
                <span>{item.content}</span>
                <button onClick={handleDeleteItem}>Delete</button>
              </div>
            })}
          </section>
        </section>
      </main>
    </div>
  );
}

export default App;

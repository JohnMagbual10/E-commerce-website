import { useState, useEffect } from 'react'

const Login = ({ login })=> {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = ev => {
    ev.preventDefault();
    login({ username, password });
  }
  return (
    <form onSubmit={ submit }>
      <input value={ username } placeholder='username' onChange={ ev=> setUsername(ev.target.value)}/>
      <input value={ password} placeholder='password' onChange={ ev=> setPassword(ev.target.value)}/>
      <button disabled={ !username || !password }>Login</button>
    </form>
  );
}

function App() {
  const [auth, setAuth] = useState({});
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(()=> {
    attemptLoginWithToken();
  }, []);

  const attemptLoginWithToken = async()=> {
    const token = window.localStorage.getItem('token');
    if(token){
      const response = await fetch(`/api/auth/me`, {
        headers: {
          authorization: token
        }
      });
      const json = await response.json();
      if(response.ok){
        setAuth(json);
      }
      else {
        window.localStorage.removeItem('token');
      }
    }
  };

  useEffect(()=> {
    const fetchProducts = async()=> {
      const response = await fetch('/api/products');
      const json = await response.json();
      setProducts(json);
    };

    fetchProducts();
  }, []);

  useEffect(()=> {
    const fetchFavorites = async()=> {
      const response = await fetch(`/api/users/${auth.id}/favorites`);
      const json = await response.json();
      if(response.ok){
        setFavorites(json);
      }
    };
    if(auth.id){
      fetchFavorites();
    }
    else {
      setFavorites([]);
    }
  }, [auth]);

  const login = async (credentials) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const json = await response.json();
      window.localStorage.setItem('token', json.token);
      attemptLoginWithToken();
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  

  const addFavorite = async(product_id)=> {
    const response = await fetch(`/api/users/${auth.id}/favorites`, {
      method: 'POST',
      body: JSON.stringify({ product_id }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const json = await response.json();
    if(response.ok){
      setFavorites([...favorites, json]);
    }
    else {
      console.log(json);
    }
  }

  const removeFavorite = async(id)=> {
    const response = await fetch(`/api/users/${auth.id}/favorites/${id}`, {
      method: 'DELETE',
    });

    if(response.ok){
      setFavorites(favorites.filter(favorite => favorite.id !== id));
    }
    else {
      console.log(json);
    }
  }

  const logout = ()=> {
    window.localStorage.removeItem('token');
    setAuth({});
  };

  return (
    <>
      {
        !auth.id ? <Login login={ login }/> : <button onClick={ logout }>Logout { auth.username }</button>
      }
      <ul>
        {
          products.map( product => {
            const isFavorite = favorites.find(favorite => favorite.product_id === product.id);
            return (
              <li key={ product.id } className={ isFavorite ? 'favorite': ''}>
                { product.name }
                {
                  auth.id && isFavorite && <button onClick={()=> removeFavorite(isFavorite.id)}>-</button>
                }
                {
                  auth.id && !isFavorite && <button onClick={()=> addFavorite(product.id)}>+</button>
                }
              </li>
            );
          })
        }
      </ul>
    </>
  )
}

export default App

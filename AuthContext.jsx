import { createContext, useContext, useState, useEffect } from "react";

const AuthCtx = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("auth_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("auth_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("auth_user");
    }
  }, [user]);

  const signup = (email, password, name) => {
    const users = JSON.parse(localStorage.getItem("auth_users") || "[]");
    const exists = users.find((u) => u.email === email);
    if (exists) {
      throw new Error("Email already exists");
    }
    const newUser = { id: Date.now().toString(), email, password, name };
    users.push(newUser);
    localStorage.setItem("auth_users", JSON.stringify(users));
    setUser({ id: newUser.id, email, name });
    return newUser;
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("auth_users") || "[]");
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) {
      throw new Error("Invalid email or password");
    }
    setUser({ id: found.id, email: found.email, name: found.name });
    return found;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);

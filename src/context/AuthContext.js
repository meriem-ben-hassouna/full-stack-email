import { createContext } from "react";

// Plain context object, kept in its own non-component module so that
// Vite/React Fast Refresh never has to reconcile a file that mixes a
// component export (AuthProvider) with a hook export (useAuth) — mixing
// those in one .jsx file is a common cause of hooks silently resolving
// to `undefined` after a hot reload.
const AuthContext = createContext(null);

export default AuthContext;

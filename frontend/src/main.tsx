import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./redux/store.ts";
import { ThemeProvider } from "./shared/providers/ThemeProvider.tsx";
import { Toaster } from "./shared/components/Toaster.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeProvider>
      <Toaster />
      <App />
    </ThemeProvider>
  </Provider>,
);

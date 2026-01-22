import React, {
  useState,
  useEffect,
  useContext,
  useReducer,
  useMemo,
  useCallback,
  useRef,
  createContext,
} from "react";
import { BrowserRouter, Routes, Route, NavLink, Link, useLocation, useParams, Outlet, Navigate, useNavigate } from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  styled,
} from "@mui/material/styles";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  Grid,
  TextField,
  Typography,
  Toolbar,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import "./App.css";

// Theme context to demonstrate useContext alongside MUI theme toggling
const ThemeModeContext = createContext({ mode: "light", toggle: () => {} });

const NavLinkButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  "&.active": {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.dark,
  },
}));

function useCounterReducer(initial = 0) {
  function reducer(state, action) {
    switch (action.type) {
      case "inc":
        return state + 1;
      case "dec":
        return state - 1;
      case "reset":
        return initial;
      default:
        return state;
    }
  }
  return useReducer(reducer, initial);
}

function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { mode, toggle } = useContext(ThemeModeContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Close drawer on route change for better UX
    setDrawerOpen(false);
  }, [location.pathname]);

  const handleNavigateHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <>
      <header>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Semantic & Modern React
            </Typography>
            <NavLinkButton
              component={NavLink}
              to="/"
              sx={{ mr: 1 }}
            >
              Home
            </NavLinkButton>
            <NavLinkButton
              component={NavLink}
              to="/articles/42"
              sx={{ mr: 1 }}
            >
              Article 42
            </NavLinkButton>
            <NavLinkButton
              component={NavLink}
              to="/section"
              sx={{ mr: 1 }}
            >
              Section
            </NavLinkButton>
            <Button color="inherit" onClick={toggle}>
              Toggle {mode === "light" ? "Dark" : "Light"}
            </Button>
          </Toolbar>
        </AppBar>
      </header>

      <nav>
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box sx={{ width: 250, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Navigation
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button component={Link} to="/" onClick={() => setDrawerOpen(false)}>
                Home
              </Button>
              <Button component={Link} to="/articles/7" onClick={() => setDrawerOpen(false)}>
                Article 7
              </Button>
              <Button component={Link} to="/section" onClick={() => setDrawerOpen(false)}>
                Section
              </Button>
              <Button onClick={handleNavigateHome}>Go programmatically</Button>
            </Box>
          </Box>
        </Drawer>
      </nav>

      <main>
        <Box sx={{ p: 2 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/articles/:id" element={<ArticleLayout />}>
              <Route index element={<Navigate to="details" replace />} />
              <Route path="details" element={<ArticleDetails />} />
            </Route>
            <Route path="/section" element={<Section />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
      </main>

      <aside>
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Aside: helpful links and tips live here.
          </Typography>
        </Box>
      </aside>

      <footer>
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="caption">
            © {new Date().getFullYear()} Modern React + MUI v7
          </Typography>
        </Box>
      </footer>
    </>
  );
}

function Home() {
  const [count, dispatch] = useCounterReducer(0);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const expensiveValue = useMemo(() => {
    // Simulate an expensive computation
    const n = 100000;
    let sum = 0;
    for (let i = 0; i < n; i++) sum += i;
    return sum + count;
  }, [count]);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <article>
      <Typography variant="h4" gutterBottom>
        Home
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <section>
            <Typography variant="h6">Counter (useReducer)</Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 1 }}>
              <Button variant="contained" onClick={() => dispatch({ type: "dec" })}>
                -1
              </Button>
              <Typography variant="h6">{count}</Typography>
              <Button variant="contained" onClick={() => dispatch({ type: "inc" })}>
                +1
              </Button>
              <Button variant="outlined" onClick={() => dispatch({ type: "reset" })}>
                Reset
              </Button>
            </Box>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Expensive derived value (useMemo): {expensiveValue}
            </Typography>
          </section>
        </Grid>

        <Grid item xs={12} md={6}>
          <section>
            <Typography variant="h6">Form (useRef, useCallback)</Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 1 }}>
              <TextField
                inputRef={inputRef}
                label="Type something"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                size="small"
              />
              <Button variant="outlined" onClick={focusInput}>
                Focus
              </Button>
            </Box>
          </section>
        </Grid>
      </Grid>
    </article>
  );
}

function ArticleLayout() {
  const { id } = useParams();
  return (
    <article>
      <Typography variant="h4" gutterBottom>
        Article {id}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Nested routes demonstrate Outlet usage.
      </Typography>
      <Outlet />
    </article>
  );
}

function ArticleDetails() {
  const location = useLocation();

  useEffect(() => {
    // Example effect tied to location changes
    // Could be analytics or fetching based on route
  }, [location.pathname]);

  return (
    <section>
      <Typography variant="h6" gutterBottom>
        Details
      </Typography>
      <Typography variant="body2">
        This is the details subsection for the current article.
      </Typography>
    </section>
  );
}

function Section() {
  return (
    <section>
      <Typography variant="h4" gutterBottom>
        Section
      </Typography>
      <Box sx={{ my: 2 }}>
        <Typography variant="body1">
          A semantic section with MUI layout components.
        </Typography>
      </Box>
    </section>
  );
}

function NotFound() {
  return (
    <section>
      <Typography variant="h4" gutterBottom>
        Not found
      </Typography>
      <Typography variant="body2">
        The page you’re looking for doesn’t exist.
      </Typography>
    </section>
  );
}

export default function App() {
  const [mode, setMode] = useState("light");
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#1976d2" },
        },
      }),
    [mode]
  );

  const toggle = useCallback(() => {
    setMode((m) => (m === "light" ? "dark" : "light"));
  }, []);

  return (
    <ThemeModeContext.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { Navigate } from "react-router-dom";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { Router } from "./../../config/Routes/index";
import { liveApi } from "../../utils/env";

import SweetAlert2 from "react-sweetalert2";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

interface LoginPage extends Router {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
  checkLogin: () => void
}

export default function SignUp({ setIsLoggedIn, checkLogin }: LoginPage) {
  const [swalProps, setSwalProps] = React.useState({});

  const handleSubmit = event => {
    event.preventDefault();
    const dataReg = new FormData(event.currentTarget);

    const client = new ApolloClient({
      uri: liveApi,
      cache: new InMemoryCache()
    });

    const query = gql`
      mutation Register {
        auth {
          register(
            input: {
              name: "${dataReg.get("firstName")}",
              username: "${dataReg.get("username")}", 
              email: "${dataReg.get("email")}", 
              password: "${dataReg.get("password")}"
            }
          )
        }
      }
    `;
    client
      .mutate({
        mutation: query
      })
      .then(result => {
        setSwalProps({
          show: true,
          title: "Success",
          text: "Success Created Accound",
          icon: "success",
          onConfirm: () => {
            <Navigate to="/login" replace={true} />;
          }
        });
        checkLogin();
      })
      .catch(error => {
        setSwalProps({
          show: true,
          title: "Error",
          icon: "error",
          text: error
        });
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <SweetAlert2 {...swalProps} />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}

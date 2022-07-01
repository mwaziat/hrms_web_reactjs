import React, { Component } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
// import InfoIcon from "@mui/icons-material/Info";
// import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
// import MUIDataTable from "mui-datatables";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { DataGrid } from "@mui/x-data-grid";
import SweetAlert2 from "react-sweetalert2";
import {
  ApolloClient,
  InMemoryCache,
  gql,
  createHttpLink
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { liveApi } from "../../utils/env";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4
};

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

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== "open"
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== "open"
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9)
      }
    })
  }
}));

const mdTheme = createTheme();

class Dahsboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      swalProps: {},
      open: true,
      openModal: false,
      openModalEdit: false,
      resultData: [],
      dataRows: [],
      dataEdit: {
        firstName: ""
      },
      formValue: {}
    };
  }

  componentDidMount() {
    this.getDataEmpolyee();
  }

  toggleDrawer = props => {
    this.setState({
      open: props === "open" ? true : false
    });
  };

  handleChange = (e, valuename) => {
    this.setState(prevState => ({
      ...prevState,
      formValue: {
        ...prevState.formValue,
        [valuename]: e
      }
    }));
  };

  TogleModal = (state, action, index) => {
    if (state === "add") {
      this.setState({
        openModal: action === "0" ? false : true
      });
    } else if (state === "edit") {
      this.setState({
        openModalEdit: action === "0" ? false : true,
        dataEdit: {
          _id:
            index === ""
              ? ""
              : this.state.resultData[index]._id === undefined
              ? ""
              : this.state.resultData[index]._id,
          firstName:
            index === ""
              ? ""
              : this.state.resultData[index].firstName === undefined
              ? ""
              : this.state.resultData[index].firstName,
          lastName:
            index === ""
              ? ""
              : this.state.resultData[index].lastName === undefined
              ? ""
              : this.state.resultData[index].lastName,
          email:
            index === ""
              ? ""
              : this.state.resultData[index].email === undefined
              ? ""
              : this.state.resultData[index].email,
          address:
            index === ""
              ? ""
              : this.state.resultData[index].address === undefined
              ? ""
              : this.state.resultData[index].address,
          position:
            index === ""
              ? ""
              : this.state.resultData[index].position === undefined
              ? ""
              : this.state.resultData[index].position
        }
      });
    } else {
      this.setState({
        swalProps: {
          show: true,
          title: "Warning",
          icon: "warning",
          text: "Sure you want to delete it",
          showCancelButton: true,
          didOpen: () => {},
          didClose: () => {
            this.setState({
              swalProps: {}
            });
          },
          onConfirm: () => {
            console.log("onConfirm");
            this.handleDelete(
              index === ""
                ? ""
                : this.state.resultData[index]._id === undefined
                ? ""
                : this.state.resultData[index]._id
            );
          }
        }
      });
    }
  };

  columns = [
    // { field: "id", headerName: "ID", width: 70 },
    { field: "firstName", headerName: "First name", width: 130 },
    { field: "lastName", headerName: "Last name", width: 130 },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: params =>
        `${params.row.firstName || ""} ${params.row.lastName || ""}`
    },
    {
      field: "email",
      headerName: "Email",
      width: 170
    },
    {
      field: "position",
      headerName: "Department",
      width: 170
    },
    {
      field: "address",
      headerName: "Address",
      width: 170
    },
    {
      field: "action",
      headerName: "Action",
      width: 170,
      sortable: false,
      renderCell: params => {
        // const onClick = (e, event) => {
        //   e.stopPropagation(); // don't select this row after clicking

        //   const api: GridApi = params.api;
        //   const thisRow: Record<string, GridCellValue> = {};

        //   api
        //     .getAllColumns()
        //     .filter(c => c.field !== "__check__" && !!c)
        //     .forEach(
        //       c => (thisRow[c.field] = params.getValue(params.id, c.field))
        //     );
        //     console.log(thisRow)
        //     console.log(params.api)
        //   // return alert(JSON.stringify(thisRow, null, 4));
        // };

        return (
          <>
            <Button
              color="info"
              onClick={e => this.TogleModal("edit", "1", params.id)}
            >
              Edit
            </Button>
            <Button
              color="error"
              onClick={e => this.TogleModal("delete", "1", params.id)}
            >
              Delete
            </Button>
          </>
        );
      }
    }
  ];

  // Handle Function Submit Add
  handleSubmit = event => {
    event.preventDefault();
    const dataAddEmployee = new FormData(event.currentTarget);

    const authLink = setContext((_, { headers }) => {
      const token = localStorage.getItem("jwt");
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : ""
        }
      };
    });

    const httpLink = createHttpLink({
      uri: liveApi()
    });

    const client = new ApolloClient({
      credentials: "same-origin",
      link: authLink.concat(httpLink),
      cache: new InMemoryCache()
    });
    const query = gql`mutation createEmployee {
      createEmployee(input: 
      {
        firstName: "${dataAddEmployee.get("firstName")}", 
        lastName:"${dataAddEmployee.get("lastName")}", 
        email:"${dataAddEmployee.get("email")}", 
        address:"${dataAddEmployee.get("address")}", 
        position:"${dataAddEmployee.get("position")}"
      }) {
        email
        firstName
      }
    }
    `;

    client
      .mutate({
        mutation: query
      })
      .then(result => {
        this.TogleModal("add", "0", "");
        this.getDataEmpolyee();
        this.setState({
          swalProps: {
            show: true,
            title: "Succes",
            icon: "success",
            text: "Your Work Saved"
          }
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({
          swalProps: {
            show: true,
            title: "Error",
            icon: "error",
            text: error
          }
        });
      });
  };

  // Handle function Get All
  getDataEmpolyee = () => {
    const authLink = setContext((_, { headers }) => {
      // get the authentication token from local storage if it exists
      const token = localStorage.getItem("jwt");
      // return the headers to the context so httpLink can read them
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : ""
        }
      };
    });

    const httpLink = createHttpLink({
      uri: liveApi()
    });

    const client = new ApolloClient({
      credentials: "same-origin",
      link: authLink.concat(httpLink),
      cache: new InMemoryCache()
    });

    const query = gql`
      query findEmployee {
        employees {
          _id
          firstName
          lastName
          email
          address
          position
        }
      }
    `;
    client
      .query({
        query: query
      })
      .then(result => {
        const data = result.data.employees;
        var i = 0;
        var dataEmp = [];
        data.forEach(item => {
          console.log(item._id);
          dataEmp.push({
            id: i++,
            lastName: item.lastName,
            firstName: item.firstName,
            email: item.email,
            position: item.position,
            address: item.address
          });
        });
        this.setState({
          resultData: data,
          dataRows: dataEmp
        });
      })
      .catch(error => {
        this.setState({
          swalProps: {
            show: true,
            title: "Error",
            icon: "error",
            text: error
          }
        });
      });
  };

  // Handle function Submit Edit
  handleSubmitEdit = event => {
    event.preventDefault();
    const dataAddEmployee = new FormData(event.currentTarget);
    const authLink = setContext((_, { headers }) => {
      // get the authentication token from local storage if it exists
      const token = localStorage.getItem("jwt");
      // return the headers to the context so httpLink can read them
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : ""
        }
      };
    });

    const httpLink = createHttpLink({
      uri: liveApi()
    });

    const client = new ApolloClient({
      credentials: "same-origin",
      link: authLink.concat(httpLink),
      cache: new InMemoryCache()
    });
    const query = gql`mutation updateEmployee{
      updateEmployee(_id:  "${this.state.dataEdit._id}", 
        input: {
          firstName: "${dataAddEmployee.get("firstNameEdit")}", 
          lastName:"${dataAddEmployee.get("lastNameEdit")}", 
          email:"${dataAddEmployee.get("emailEdit")}", 
          address:"${dataAddEmployee.get("addressEdit")}", 
          position:"${dataAddEmployee.get("positionEdit")}"
        }){
        _id
        firstName
        lastName
      }
    }
    `;
    client
      .mutate({
        mutation: query
      })
      .then(result => {
        this.TogleModal("edit", "0", "");
        this.getDataEmpolyee();
        this.setState({
          swalProps: {
            show: true,
            title: "Succes",
            icon: "success",
            text: "Your Work Saved"
          }
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({
          swalProps: {
            show: true,
            title: "Error",
            icon: "error",
            text: error
          }
        });
      });
  };

  handleDelete = id => {
    if (id !== "") {
      const authLink = setContext((_, { headers }) => {
        const token = localStorage.getItem("jwt");
        return {
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ""
          }
        };
      });

      const httpLink = createHttpLink({
        uri: liveApi()
      });

      const client = new ApolloClient({
        credentials: "same-origin",
        link: authLink.concat(httpLink),
        cache: new InMemoryCache()
      });
      const query = gql`
        mutation deleteEmpl {
          deleteEmployee(_id: id)
        }
      `;

      client
        .mutate({
          mutation: query
        })
        .then(result => {
          this.TogleModal("add", "0", "");
          this.getDataEmpolyee();
          this.setState({
            swalProps: {
              show: true,
              title: "Succes",
              icon: "success",
              text: "Your Work Saved"
            }
          });
        })
        .catch(error => {
          console.error(error);
          this.setState({
            swalProps: {
              show: true,
              title: "Error",
              icon: "error",
              text: error
            }
          });
        });
    }
  };

  render() {
    return (
      <ThemeProvider theme={mdTheme}>
        <SweetAlert2 {...this.state.swalProps} />
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar position="absolute" open={this.state.open}>
            <Toolbar
              sx={{
                pr: "24px" // keep right padding when drawer closed
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={e => this.toggleDrawer("open")}
                sx={{
                  marginRight: "36px",
                  ...(this.state.open && { display: "none" })
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                Dashboard
              </Typography>
              <IconButton color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={this.state.open}>
            <Toolbar
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                px: [1]
              }}
            >
              <IconButton onClick={e => this.toggleDrawer("close")}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">
              <ListItemButton>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </List>
          </Drawer>
          <Box
            component="main"
            sx={{
              backgroundColor: theme =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto"
            }}
          >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Grid container spacing={3}>
                {/* Recent Orders */}
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={e => this.TogleModal("add", "1", "")}
                    startIcon={<AddIcon />}
                    sx={{ mb: 3 }}
                  >
                    Create Employee
                  </Button>

                  <Modal
                    open={this.state.openModal}
                    onClose={e => this.TogleModal("add", "0", "")}
                  >
                    <Fade in={this.state.openModal}>
                      <Box
                        sx={style}
                        component="form"
                        onSubmit={this.handleSubmit}
                        noValidate
                      >
                        <Typography
                          id="transition-modal-title"
                          variant="h6"
                          component="h2"
                        >
                          Create Employee
                        </Typography>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="firstName"
                          label="First Name"
                          type="text"
                          id="firstName"
                        />
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="lastName"
                          label="Last Name"
                          type="text"
                          id="lastName"
                        />
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="email"
                          label="Email"
                          type="text"
                          id="email"
                        />
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="address"
                          label="Addres"
                          type="text"
                          id="address"
                        />
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="position"
                          label="Department"
                          type="text"
                          id="position"
                        />
                        <Stack spacing={2} direction="row">
                          <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                          >
                            Save Data
                          </Button>
                          <Button
                            onClick={e => this.TogleModal("add", "0", "")}
                            variant="text"
                            sx={{ mt: 3, mb: 2 }}
                          >
                            Close
                          </Button>
                        </Stack>
                      </Box>
                    </Fade>
                  </Modal>

                  <Modal
                    open={this.state.openModalEdit}
                    onClose={e => this.TogleModal("edit", "0", "")}
                  >
                    <Fade in={this.state.openModalEdit}>
                      <Box
                        sx={style}
                        component="form"
                        onSubmit={this.handleSubmitEdit}
                        noValidate
                      >
                        <Typography
                          id="transition-modal-title"
                          variant="h6"
                          component="h2"
                        >
                          Edit Employee
                        </Typography>
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="firstNameEdit"
                          label="First Name"
                          type="text"
                          id="firstNameEdit"
                          value={
                            this.state.formValue.firstNameEdit
                              ? this.state.formValue.firstNameEdit
                              : this.state.dataEdit.firstName
                          }
                          onChange={e =>
                            this.handleChange(e.target.value, e.target.name)
                          }
                        />
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="lastNameEdit"
                          label="Last Name"
                          type="text"
                          id="lastNameEdit"
                          value={
                            this.state.formValue.lastNameEdit
                              ? this.state.formValue.lastNameEdit
                              : this.state.dataEdit.lastName
                          }
                          onChange={e =>
                            this.handleChange(e.target.value, e.target.name)
                          }
                        />
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="emailEdit"
                          label="Email"
                          type="text"
                          id="emailEdit"
                          value={
                            this.state.formValue.emailEdit
                              ? this.state.formValue.emailEdit
                              : this.state.dataEdit.email
                          }
                          onChange={e =>
                            this.handleChange(e.target.value, e.target.name)
                          }
                        />
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="addressEdit"
                          label="Addres"
                          type="text"
                          id="addressEdit"
                          value={
                            this.state.formValue.addressEdit
                              ? this.state.formValue.addressEdit
                              : this.state.dataEdit.address
                          }
                          onChange={e =>
                            this.handleChange(e.target.value, e.target.name)
                          }
                        />
                        <TextField
                          margin="normal"
                          required
                          fullWidth
                          name="positionEdit"
                          label="Department"
                          type="text"
                          id="positionEdit"
                          value={
                            this.state.formValue.positionEdit
                              ? this.state.formValue.positionEdit
                              : this.state.dataEdit.position
                          }
                          onChange={e =>
                            this.handleChange(e.target.value, e.target.name)
                          }
                        />
                        <Stack spacing={2} direction="row">
                          <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                          >
                            Save Data
                          </Button>
                          <Button
                            onClick={e => this.TogleModal("edit", "0", "")}
                            variant="text"
                            sx={{ mt: 3, mb: 2 }}
                          >
                            Close
                          </Button>
                        </Stack>
                      </Box>
                    </Fade>
                  </Modal>
                  {/* <MUIDataTable
                    columns={columns}
                    options={options}
                    data={dataEmployee}
                  /> */}
                  <div style={{ height: 400, width: "100%" }}>
                    <DataGrid
                      rows={this.state.dataRows}
                      columns={this.columns}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      // checkboxSelection
                    />
                  </div>
                </Grid>
              </Grid>
              <Copyright sx={{ pt: 4 }} />
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }
}

export default Dahsboard;

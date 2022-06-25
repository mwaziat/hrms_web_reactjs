import * as React from 'react'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import MuiDrawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import NotificationsIcon from '@mui/icons-material/Notifications'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DashboardIcon from '@mui/icons-material/Dashboard'
import InfoIcon from '@mui/icons-material/Info'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import MUIDataTable from 'mui-datatables'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import SweetAlert2 from 'react-sweetalert2'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

function Copyright (props) {
  return (
    <Typography
      variant='body2'
      color='text.secondary'
      align='center'
      {...props}
    >
      {'Copyright © '}
      <Link color='inherit' href='https://mui.com/'>
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const drawerWidth = 240

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open'
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open'
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9)
      }
    })
  }
}))

const mdTheme = createTheme()

function DashboardContent () {
  const [swalProps, setSwalProps] = React.useState({})
  const [dataResult, setResultData] = React.useState([])
  const [dataEmployee, setDataEmployee] = React.useState([])
  const [openModal, setOpenModal] = React.useState(false)
  const [linkKey, setLinkKey] = React.useState('')
  const handleOpen = () => setOpenModal(true)
  const handleClose = () => setOpenModal(false)

  const columns = [
    {
      name: 'No',
      options: {
        filter: true
      }
    },
    {
      label: 'Name',
      name: 'Title',
      options: {
        filter: true
      }
    },
    {
      label: 'Email',
      name: 'Title',
      options: {
        filter: true
      }
    },
    {
      label: 'Department',
      name: 'Title',
      options: {
        filter: true
      }
    },
    {
      name: 'Detail',
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          return (
            <Button
              className='btn-icon'
              color='info'
              size='small'
              variant='outlined'
              type='button'
              onClick={() => this.toggleModal2('Modal', dataIndex, 1)}
              startIcon={<InfoIcon />}
            >
              Info
            </Button>
          )
        }
      }
    },
    {
      name: 'Edit',
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          return (
            <Link
              onClick={() => setLinkKey(dataIndex)}
              key={linkKey}
              to={'/edit-employee'}
              state={{ key: linkKey }}
              startIcon={<EditIcon />}
              className='btn-icon'
              size='small'
              variant='outlined'
            >
              Edit{' '}
            </Link>
            // <Button
            //   className='btn-icon'
            //   color='success'
            //   size='small'
            //   variant='outlined'
            //   type='button'
            //   onClick={() => handleEditEmployee(dataIndex)}
            //   startIcon={<EditIcon />}
            // >
            //   Edit{' '}
            // </Button>
          )
        }
      }
    }
  ]

  const options = {
    filter: true,
    filterType: 'dropdown',
    responsive: 'vertical',
    selectableRows: false,
    onColumnSortChange: (changedColumn, direction) =>
      console.log('changedColumn: ', changedColumn, 'direction: ', direction),
    onChangeRowsPerPage: numberOfRows =>
      console.log('numberOfRows: ', numberOfRows),
    onChangePage: currentPage => console.log('currentPage: ', currentPage)
  }

  function getDataEmpolyee () {
    const client = new ApolloClient({
      uri: 'http://localhost:8080/query',
      cache: new InMemoryCache()
    })

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
    `
    client
      .query({
        query: query
      })
      .then(result => {
        const data = result.data.employees
        var i = 1
        var dataEmp = []
        data.forEach(item => {
          dataEmp.push([
            i++,
            item.firstName + ' ' + item.lastName,
            item.email,
            item.position
          ])
        })
        setResultData(data)
        setDataEmployee(dataEmp)
      })
      .catch(error => {
        setSwalProps({
          show: true,
          title: 'Error',
          text: error
        })
      })
  }

  const handleSubmit = event => {
    event.preventDefault()
    const dataAddEmployee = new FormData(event.currentTarget)
    const client = new ApolloClient({
      uri: 'http://localhost:8080/query',
      cache: new InMemoryCache()
    })
    const query = gql`mutation createEmployee {
      createEmployee(input: 
      {
        firstName: "${dataAddEmployee.get('firstName')}", 
        lastName:"${dataAddEmployee.get('lastName')}", 
        email:"${dataAddEmployee.get('email')}", 
        address:"${dataAddEmployee.get('address')}", 
        position:"${dataAddEmployee.get('position')}"
      }) {
        email
        firstName
      }
    }
    `
    client
      .mutate({
        mutation: query
      })
      .then(result => {
        console.log(result.data)
        handleClose()
        setSwalProps({
          show: true,
          title: 'Succes',
          text: 'Your Work Saved'
        })
      })
      .catch(error => {
        console.error(error)
        setSwalProps({
          show: true,
          title: 'Error',
          text: error
        })
      })
  }

  const handleEditEmployee = index => {
    this.props.history.push('/edit-employee/' + index)
  }

  const [open, setOpen] = React.useState(true)
  const toggleDrawer = () => {
    setOpen(!open)
  }

  React.useEffect(() => {
    getDataEmpolyee()
  }, [])

  return (
    <ThemeProvider theme={mdTheme}>
      <SweetAlert2 {...swalProps} />
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position='absolute' open={open}>
          <Toolbar
            sx={{
              pr: '24px' // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge='start'
              color='inherit'
              aria-label='open drawer'
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' })
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component='h1'
              variant='h6'
              color='inherit'
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
            <IconButton color='inherit'>
              <Badge badgeContent={4} color='secondary'>
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant='permanent' open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1]
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component='nav'>
            <ListItemButton>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary='Dashboard' />
            </ListItemButton>
          </List>
        </Drawer>
        <Box
          component='main'
          sx={{
            backgroundColor: theme =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto'
          }}
        >
          <Toolbar />
          <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Button
                  variant='contained'
                  onClick={handleOpen}
                  startIcon={<AddIcon />}
                  sx={{ mb: 3 }}
                >
                  Create Employee
                </Button>
                <Modal open={openModal} onClose={handleClose}>
                  <Fade in={openModal}>
                    <Box
                      sx={style}
                      component='form'
                      onSubmit={handleSubmit}
                      noValidate
                    >
                      <Typography
                        id='transition-modal-title'
                        variant='h6'
                        component='h2'
                      >
                        Create Employee
                      </Typography>
                      <TextField
                        margin='normal'
                        required
                        fullWidth
                        name='firstName'
                        label='First Name'
                        type='text'
                        id='firstName'
                      />
                      <TextField
                        margin='normal'
                        required
                        fullWidth
                        name='lastName'
                        label='Last Name'
                        type='text'
                        id='lastName'
                      />
                      <TextField
                        margin='normal'
                        required
                        fullWidth
                        name='email'
                        label='Email'
                        type='text'
                        id='email'
                      />
                      <TextField
                        margin='normal'
                        required
                        fullWidth
                        name='address'
                        label='Addres'
                        type='text'
                        id='address'
                      />
                      <TextField
                        margin='normal'
                        required
                        fullWidth
                        name='position'
                        label='Department'
                        type='text'
                        id='position'
                      />
                      <Stack spacing={2} direction='row'>
                        <Button
                          type='submit'
                          variant='contained'
                          sx={{ mt: 3, mb: 2 }}
                        >
                          Save Data
                        </Button>
                        <Button
                          onClick={handleClose}
                          variant='text'
                          sx={{ mt: 3, mb: 2 }}
                        >
                          Close
                        </Button>
                      </Stack>
                    </Box>
                  </Fade>
                </Modal>

                {/* <Modal open={openModalEdit} onClose={setOpenModalEdit(false)}>
                  <Fade in={openModalEdit}>
                    <Box
                      sx={style}
                      component='form'
                      // onSubmit={handleSubmit}
                      noValidate
                    >
                      <Typography
                        id='transition-modal-title'
                        variant='h6'
                        component='h2'
                      >
                        Edit Employee
                      </Typography>
                      <TextField
                        margin='normal'
                        required
                        fullWidth
                        name='firstNameEdit'
                        label='First Name'
                        type='text'
                        id='firstNameEdit'
                        value={dataEdit.firstName}
                      />
                      <TextField
                        margin='normal'
                        required
                        fullWidth
                        name='lastNameEdit'
                        label='Last Name'
                        type='text'
                        id='lastNameEdit'
                        value={dataEdit.lastName}
                      />
                      <TextField
                        margin='normal'
                        required
                        fullWidth
                        name='emailEdit'
                        label='Email'
                        type='text'
                        id='emailEdit'
                        value={dataEdit.email}
                      />
                      <TextField
                        margin='normal'
                        required
                        fullWidth
                        name='addressEdit'
                        label='Addres'
                        type='text'
                        id='addressEdit'
                        value={dataEdit.address}
                      />
                      <TextField
                        margin='normal'
                        required
                        fullWidth
                        name='positionEdit'
                        label='Department'
                        type='text'
                        id='positionEdit'
                        value={dataEdit.position}
                      />
                      <Stack spacing={2} direction='row'>
                        <Button
                          type='submit'
                          variant='contained'
                          sx={{ mt: 3, mb: 2 }}
                        >
                          Save Data
                        </Button>
                        <Button
                          onClick={handleClose}
                          variant='text'
                          sx={{ mt: 3, mb: 2 }}
                        >
                          Close
                        </Button>
                      </Stack>
                    </Box>
                  </Fade>
                </Modal> */}
                <MUIDataTable
                  columns={columns}
                  options={options}
                  data={dataEmployee}
                />
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default function Dashboard () {
  return <DashboardContent />
}

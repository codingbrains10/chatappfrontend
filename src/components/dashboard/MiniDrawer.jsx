// export default Profile;
import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profileIcon from "../../assets/uploads/profile.jpg";
import "../../assets/css/Profile.css";
import {
  Avatar,
  Button,
  ListItemAvatar,
  Stack,
  TextField,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import Input from "@mui/material/Input";
import echo from "../../assets/js/Echo";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

export default function MiniDrawer() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true);
  const [userData, setUserData] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  // const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);
  const [message, setMessage] = useState([]);
  const [messageData, setMessageData] = useState(null);
  const [getUserChatData, setGetUserChatData] = useState([]);
  // const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // console.log("message ankit ----------------------", selectedUser);

  // fetch single user data
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // fetch all users data except the logged in user
  useEffect(() => {
    const fetchAllUsers = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/allusers", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users data");
        }

        const data = await response.json();
        console.log(data);
        // Check if the data is an array and contains users
        if (data.status && Array.isArray(data.data)) {
          setAllUsers(data.data); // Set the users data
        } else {
          setError("Invalid data format or empty users data");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, [navigate]);

  // show selected user profile data in the header
  const sideLabelHandler = (userData) => {
    setSelectedUserProfile(userData);
    getUserChat(userData.id);
  };

  // handle send message functionality
  const sendMessage = async () => {
    const sender_id = userData.id;
    const receiver_id = selectedUserProfile.id;

    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/sendmessage", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_id,
          receiver_id,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      setMessageData(data.message);
      console.log("Message sent successfully:", data);
    } catch (error) {
      console.error("Error on sending message: ", error);
    } finally {
      setMessage(""); // Clear input
    }
  };

  // handle fetch message by user id
  const getUserChat = async (receiver_id) => {
    const senderId = userData.id;
    const receiverId = receiver_id;
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/getmessages?sender_id=${senderId}&receiver_id=${receiverId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user chat data");
      }

      // const data = await response.json();
      if (response.ok) {
        const data = await response.json();
        if (data.messages && data.messages.length > 0) {
          setGetUserChatData(data.messages);
        } else {
          setGetUserChatData([]); // No messages found
        }
      } else {
        setGetUserChatData([]); // Handle the case where no messages exist
      }
    } catch (error) {
      console.error("Error fetching user chat:", error);
      setGetUserChatData([]);
    } finally {
      setLoading(false);
    }

    console.log("Reciver user ID:", receiverId);
    console.log("Sender user ID:", senderId);
  };

  useEffect(() => {
    const receiver_id = getUserChatData.id;
    console.log("Receiver ID echo:", getUserChatData);
    if (receiver_id) {
      getUserChatData(receiver_id);
    }

    // Listen for new messages on channel 'chat'
    echo.channel("chat").listen(".message.sent", (e) => {
      console.log("Received message from WebSocket:", e.message);

      // If the new message is for the current conversation
      if (
        (e.message.sender_id === userData.id &&
          e.message.receiver_id === receiver_id) ||
        (e.message.receiver_id === userData.id &&
          e.message.sender_id === receiver_id)
      ) {
        setGetUserChatData((prevMessages) => [...prevMessages, e.message]);
      }
    });
  });
  // fetch selected user data by id
  // const getMessageByUserId = async (receiver_id) => {
  //   const senderId = userData.id;
  //   const receiverId = receiver_id;
  //   console.log("Reciver user ID:", receiver_id);
  //   console.log("Sender user ID:", userData.id);
  //   const token = localStorage.getItem("authToken");

  //   if (!token) {
  //     navigate("/login");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(
  //       `http://127.0.0.1:8000/api/get-messages?sender_id=${senderId}&receiver_id=${receiverId}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           Accept: "application/json",
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch user data");
  //     }

  //     const data = await response.json();
  //     console.log(
  //       "Selected user data message--------------------:",
  //       data.messages
  //     );
  //     setSelectedUser(data.messages);
  //   } catch (error) {
  //     setError(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // handle logout functionality
  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Clear the auth token
      localStorage.removeItem("authToken");

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if the API call fails, we still want to clear the token and redirect
      localStorage.removeItem("authToken");

      navigate("/login");
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => navigate("/login")}>Back to Login</button>
        </div>
      </div>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: "none" },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </Typography>

          {/* header section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* Profile section - top header */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                alt={selectedUserProfile?.name || "User Name"}
                src={
                  selectedUserProfile?.profile_image || "/path/to/profile.jpg"
                }
                sx={{ width: 32, height: 32, marginRight: 1 }}
              />
              <Typography variant="body1" noWrap className="user-name">
                {selectedUserProfile?.name || "John Doe"}
              </Typography>
            </Box>

            {/* Logout button - right */}
            <Button variant="contained" color="primary" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* left sidebar */}
      <Drawer variant="permanent" open={open}>
        {/* admin profile section */}
        <DrawerHeader
          sx={{
            border: "2px solid red",
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <div className="profile-card">
            {userData && (
              <div className="profile-header">
                <div className="profile-icon">
                  <img
                    src={profileIcon}
                    alt="Profile"
                    className="profile-icon"
                  />
                </div>
                <div className="profile-details">
                  <div className="user-name">{userData.name}</div>
                  <div className="user-email">{userData.number}</div>
                </div>
              </div>
            )}
          </div>
        </DrawerHeader>
        <Divider />

        {/* Registered user list */}
        {/* {allUsers && allUsers.length > 0 && (
          <Box>
            {allUsers.map((user) => (
              <ListItem
                button="true"
                key={user.id}
                onClick={() => {
                  getUserChat(user.id);
                }}
              >
                <ListItemAvatar>
                  <Avatar src={user.profile_image || undefined} alt={user.name}>
                    {!user.profile_image && <ImageIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.name}
                  secondary={`Joined: ${new Date(
                    user.created_at
                  ).toLocaleDateString()}`}
                  onClick={() => sideLabelHandler(user)}
                />
              </ListItem>
            ))}
          </Box>
        )} */}
        {allUsers && allUsers.length > 0 && (
          <Box>
            {allUsers.map((user) => (
              <ListItem
                key={user.id}
                button="true"
                onClick={() => {
                  getUserChat(user.id); // fetch chat messages
                  sideLabelHandler(user); // update selected user name in sidebar
                }}
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  mb: 1,
                  cursor: "pointer",
                }}
              >
                <ListItemAvatar>
                  <Avatar src={user.profile_image || undefined} alt={user.name}>
                    {!user.profile_image && <ImageIcon />}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={user.name}
                  secondary={`Joined: ${new Date(
                    user.created_at
                  ).toLocaleDateString()}`}
                />
              </ListItem>
            ))}
          </Box>
        )}

        <Divider />
      </Drawer>

      {/* chat message container */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#e9e9e9",
          marginTop: "64px",
          minHeight: "88vh",
          height: "88vh, auto",
        }}
      >
        {/* chat message area */}
        <Box>
          {/* <Typography variant="h6" mb={2}>
            Chat with John
          </Typography> */}
          {/* Paste the chat bubble code here */}
          {/* <Box sx={{ padding: 2 }}>
            {Array.isArray(getUserChatData) && getUserChatData.length > 0 ? (
              getUserChatData.map((item, index) => {
                const isSender = item.sender_id === userData.id;
                return (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: isSender ? "flex-end" : "flex-start",
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: "60%",
                        padding: "10px 15px",
                        borderRadius: "16px",
                        backgroundColor: isSender ? "#DCF8C6" : "#ffffff",
                        color: "#000",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.15)",
                        borderTopRightRadius: isSender ? 0 : "16px",
                        borderTopLeftRadius: isSender ? "16px" : 0,
                      }}
                    >
                      <Typography variant="body2">{item.message}</Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          textAlign: "right",
                          marginTop: "4px",
                          color: "#888",
                        }}
                      >
                        {item.created_at &&
                          new Date(item.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                      </Typography>
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Typography
                variant="body2"
                sx={{ color: "#999", textAlign: "center" }}
              >
                No messages found for this user.
              </Typography>
            )}
          </Box> */}
          {/* <Box sx={{ padding: 2 }}>
            {Array.isArray(getUserChatData) && getUserChatData.length > 0 ? (
              getUserChatData.map((item, index) => {
                const isSender = item.sender_id === userData.id;
                return (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: isSender ? "flex-end" : "flex-start",
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: "60%",
                        padding: "10px 15px",
                        borderRadius: "16px",
                        backgroundColor: isSender ? "#DCF8C6" : "#ffffff",
                        color: "#000",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.15)",
                        borderTopRightRadius: isSender ? 0 : "16px",
                        borderTopLeftRadius: isSender ? "16px" : 0,
                      }}
                    >
                      <Typography variant="body2">{item.message}</Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          textAlign: "right",
                          marginTop: "4px",
                          color: "#888",
                        }}
                      >
                        {item.created_at &&
                          new Date(item.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                      </Typography>
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Typography
                variant="body2"
                sx={{
                  color: "#999",
                  textAlign: "center",
                  fontStyle: "italic",
                }}
              >
                No messages found for this user.
              </Typography>
            )}
          </Box> */}
          <Box>
            <Box sx={{ padding: 2, marginTop: "-25px", marginBottom: "40px" }}>
              {/* Show messages or "No messages found" */}
              {loading ? (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                >
                  Loading messages...
                </Typography>
              ) : (
                <>
                  {getUserChatData.length > 0 ? (
                    getUserChatData.map((item, index) => {
                      const isSender = item.sender_id === userData.id;
                      return (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent: isSender
                              ? "flex-end"
                              : "flex-start",
                            mb: 1,
                          }}
                        >
                          <Box
                            sx={{
                              maxWidth: "60%",
                              padding: "10px 15px",
                              borderRadius: "16px",
                              backgroundColor: isSender ? "#DCF8C6" : "#ffffff",
                              color: "#000",
                              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.15)",
                              borderTopRightRadius: isSender ? 0 : "16px",
                              borderTopLeftRadius: isSender ? "16px" : 0,
                            }}
                          >
                            <Typography variant="body2">
                              {item.message}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",
                                textAlign: "right",
                                marginTop: "4px",
                                color: "#888",
                              }}
                            >
                              {item.created_at &&
                                new Date(item.created_at).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#999",
                        textAlign: "center",
                        fontStyle: "italic",
                      }}
                    >
                      No messages found for this user.
                    </Typography>
                  )}
                </>
              )}
            </Box>
          </Box>
        </Box>

        {/* Chat input area */}
        <Box
          position="fixed"
          bottom={0}
          left={open ? 240 : 56}
          right={0}
          p={2}
          bgcolor="background.paper"
          boxShadow={3}
          display="flex"
          alignItems="center"
          gap={2}
          sx={{
            transition: "left 0.3s ease, width 0.3s ease",
            width: `calc(100% - ${open ? 240 : 56}px)`, // dynamic width
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={message ?? ""}
            onChange={(e) => setMessage(e.target.value)}
            InputProps={{
              sx: {
                "& .MuiInputBase-input": {
                  padding: "7px 14px",
                  fontSize: "1rem",
                },
              },
            }}
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

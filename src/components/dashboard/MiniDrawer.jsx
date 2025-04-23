// export default Profile;
import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profileIcon from "../../assets/uploads/profile.jpg";
import "../../assets/css/Profile.css";
import {
  Avatar,
  Button,
  ListItemAvatar,
  ListItemButton,
  Stack,
  TextField,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CheckIcon from "@mui/icons-material/Check";
import EchoInstance from "../../echo";

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
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);
  const [message, setMessage] = useState([]);
  const [getUserChatData, setGetUserChatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const fileInputRef = React.useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

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
      // 👇 After sending, immediately update your chat list!
      setGetUserChatData((prevMessages) => [
        ...prevMessages,
        {
          id: data.message.id, // id from server response
          sender_id: sender_id, // your own id
          receiver_id: receiver_id, // whom you are sending
          message: message, // message text
          created_at: new Date().toISOString(), // current timestamp
        },
      ]);
      // setMessageData(data.message);
      console.log("Message sent successfully:", data);
    } catch (error) {
      console.error("Error on sending message: ", error);
    } finally {
      setMessage(""); // Clear input
    }
  };
  // Handle Enter key press to send the message
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && message.trim()) {
      e.preventDefault(); // Prevent default action (form submit or other actions)
      sendMessage(); // Call the sendMessage function
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

          // // ✅ Mark those messages as read
          // await markMessagesAsRead(userData.id, receiverId);
          // ✅ Only mark as read if user is the receiver of the messages
          // const hasUnread = data.messages.some(
          //   (msg) => msg.receiver_id === userData.id && !msg.is_read
          // );

          // if (hasUnread) {
          //   await markMessagesAsRead(userData.id, receiverId); // senderId, receiverId
          // }
          const hasUnread = data.messages.some(
            (msg) => msg.receiver_id === userData.id && !msg.is_read
          );

          if (hasUnread) {
            await markMessagesAsRead(receiverId, userData.id);
          }
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

  const markMessagesAsRead = async (senderId, receiverId) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      await fetch("http://127.0.0.1:8000/api/message/read", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_id: senderId,
          receiver_id: receiverId,
        }),
      });
      console.log("Messages marked as read");
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  // const userId = userData?.id;
  // useEffect(() => {
  //   if (!userData || !userData.id) return;

  //   console.log("Joining channel: ", `chat.${userData.id}`);

  //   const channel = EchoInstance.private(`chat.${userData.id}`);

  //   channel.listen(".message.sent", (e) => {
  //     console.log("New message received:", e);
  //     setGetUserChatData((prevMessages) => [...prevMessages, e]);
  //   });

  //   return () => {
  //     EchoInstance.leave(`private-chat.${userData.id}`);
  //     console.log("Left channel: ", `private-chat.${userData.id}`);
  //   };
  // }, [userData]);

  useEffect(() => {
    if (!userData || !userData.id) return;

    const channelName = `chat.${userData.id}`;
    console.log("Joining channel: ", channelName);

    const channel = EchoInstance.private(channelName);

    // Listen for new incoming messages
    channel.listen(".message.sent", (e) => {
      console.log("New message received:", e);
      setGetUserChatData((prevMessages) => [...prevMessages, e]);
    });

    // Listen for message read event
    channel.listen(".MessageRead", (e) => {
      console.log("Message read event received:", e);
      setGetUserChatData((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === e.messageId ? { ...msg, is_read: true } : msg
        )
      );
    });

    return () => {
      EchoInstance.leave(channelName);
      console.log("Left channel: ", channelName);
    };
  }, [userData]);

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

  // handle message delete functionality
  const messageDeleteHandler = async (messageId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/message-delete/${messageId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete message");
      }

      const data = await response.json();
      console.log("Message deleted successfully:", data);
      // Update the chat messages state to remove the deleted message
      setGetUserChatData((prevMessages) =>
        prevMessages.filter((message) => message.id !== messageId)
      );
    } catch (error) {
      console.error("Error deleting message: ", error);
    } finally {
      setMessage(""); // Clear input if needed
    }
  };

  // handle message edit functionality
  // const messageEditHandler = async (messageId) => {
  //   const token = localStorage.getItem("authToken");
  //   if (!token) {
  //     navigate("/login");
  //     return;
  //   }
  //   console.log("Message ID to edit:", messageId);
  // };

  // handle profile image update functionality
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file)); // show preview
    }
  };

  const updateProfileImage = async () => {
    const token = localStorage.getItem("authToken");
    const userId = userData?.id;
    if (!token) {
      navigate("/login");
      return;
    }

    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("profileImage", selectedFile);
    console.log("Selected file:", selectedFile.name);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/upload-profile-image/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile image");
      }
      const data = await response.json();
      setUserData((prevState) => {
        return {
          ...prevState,
          profileImage: data.profileImage,
        };
      });
      console.log("Profile image updated successfully:", data);
    } catch (error) {
      console.error("Error updating profile image: ", error);
    } finally {
      setOpenModal(false);
    }
    console.log("Update profile image clicked", selectedFile.name);
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
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <div className="profile-card">
            {userData && (
              <div className="profile-header">
                <div
                  className="profile-icon"
                  onClick={() => {
                    setOpenModal(true);
                  }}
                >
                  <img
                    src={
                      userData?.profileImage
                        ? `http://127.0.0.1:8000/uploads/${userData.profileImage}`
                        : profileIcon // fallback if no image
                    }
                    alt="Profile"
                    className="profile-icon"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      marginRight: "10px",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      objectFit: "cover",
                    }}
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

        {/* open modal for edit or upload profile image */}
        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          PaperProps={{
            sx: { width: "400px", maxWidth: "100%", height: "360px" },
          }}
        >
          <DialogTitle sx={{ textAlign: "center" }}>
            Update Profile Picture
          </DialogTitle>
          <DialogContent>
            {/* Hidden file input + ref for programmatic click */}
            <input
              type="file"
              accept="image/*"
              // name="profileImage"
              hidden
              id="upload-profile"
              onChange={handleFileChange}
              ref={fileInputRef}
            />

            {/* Circle Box as clickable image */}
            <Box
              sx={{
                width: "200px",
                height: "200px",
                border: "1px solid #ccc",
                borderRadius: "50%",
                overflow: "hidden",
                margin: "0 auto 20px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f5f5f5",
              }}
              onClick={() => fileInputRef.current.click()}
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Typography variant="caption" color="textSecondary">
                  Click to upload
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button onClick={updateProfileImage} disabled={!selectedFile}>
              Upload
            </Button>
          </DialogActions>
        </Dialog>
        <Divider />

        {/* Registered user list */}
        {allUsers && allUsers.length > 0 && (
          <Box sx={{ padding: "5px" }}>
            {allUsers.map((user) => (
              <ListItem
                key={user.id}
                button="true"
                onClick={() => {
                  getUserChat(user.id); // fetch chat messages
                  sideLabelHandler(user); // update selected user name in sidebar
                }}
                sx={{
                  border: "1px solid red",
                  borderRadius: 2,
                  mb: 1,
                  cursor: "pointer",
                  paddingTop: "0px",
                  paddingBottom: "0px",
                  paddingLeft: "6px",
                  marginLeft: handleDrawerOpen ? "-2px" : 0,
                }}
              >
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar
                      src={
                        user.profileImage
                          ? `http://127.0.0.1:8000/uploads/${user.profileImage}`
                          : undefined
                      }
                      alt={user.name}
                    >
                      {!user.profileImage && <ImageIcon />}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={user.name}
                    secondary={`Joined: ${new Date(
                      user.created_at
                    ).toLocaleDateString()}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </Box>
        )}
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
          <Box sx={{ padding: 2, marginTop: "-25px", marginBottom: "40px" }}>
            {loading ? (
              <Typography variant="body2" color="textSecondary" align="center">
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
                            wordBreak: "break-word",
                            whiteSpace: "pre-wrap",
                            lineHeight: "1.5",
                            position: "relative",
                            "&:hover .actions": {
                              opacity: 1,
                            },
                          }}
                        >
                          <Typography variant="body2">
                            {item.message}
                          </Typography>

                          {/* <Typography
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
                          </Typography> */}
                          {/* Timestamp and Read Tick */}
                          {/* <Typography
                            variant="caption"
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              alignItems: "center",
                              gap: "4px",
                              marginTop: "4px",
                              color: "#888",
                            }}
                          >
                            {item.created_at &&
                              new Date(item.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            {isSender && item.is_read && (
                              <CheckIcon
                                fontSize="inherit"
                                sx={{ color: "#4caf50" }}
                              />
                            )}
                          </Typography> */}
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              alignItems: "center",
                              gap: "4px",
                              marginTop: "4px",
                              color: "#888",
                            }}
                          >
                            <Typography variant="caption">
                              {item.created_at &&
                                new Date(item.created_at).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                            </Typography>

                            {/* {isSender && item.is_read && (
                              <CheckIcon
                                fontSize="small"
                                sx={{ color: "#4caf50" }}
                              />
                            )} */}
                            {isSender && (
                              <>
                                {item.is_read ? (
                                  <span
                                    style={{
                                      color: "#4caf50",
                                      marginLeft: "4px",
                                    }}
                                  >
                                    ✓✓
                                  </span> // Read
                                ) : (
                                  <span
                                    style={{ color: "#888", marginLeft: "4px" }}
                                  >
                                    ✓
                                  </span> // Sent only
                                )}
                              </>
                            )}
                          </Box>

                          {/* Only show actions if this is the sender's message */}
                          {/* {isSender && (
                            <Box
                              className="actions"
                              sx={{
                                position: "absolute",
                                top: "-40px",
                                right: 0,
                                backgroundColor: "#333",
                                borderRadius: "8px",
                                padding: "2px",
                                display: "flex",
                                gap: "4px",
                                opacity: 0,
                                transition: "opacity 0.2s ease-in-out",
                              }}
                            >
                              <IconButton
                                size="small"
                                sx={{ color: "white" }}
                                onClick={() => messageDeleteHandler(item.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          )} */}
                          {isSender && (
                            <Box
                              className="actions"
                              sx={{
                                position: "absolute",
                                top: "-40px",
                                right: 0,
                                backgroundColor: "#333",
                                borderRadius: "8px",
                                padding: "2px",
                                display: "flex",
                                gap: "4px",
                                opacity: 0,
                                transition: "opacity 0.2s ease-in-out",
                              }}
                            >
                              <IconButton
                                size="small"
                                sx={{ color: "white" }}
                                onClick={() => messageDeleteHandler(item.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          )}
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
            onKeyDown={handleKeyDown}
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

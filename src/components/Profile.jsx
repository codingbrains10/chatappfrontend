// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../assets/css/Profile.css';
// import LeftSideBar from './dashboard/Profile';

// const Profile = () => {
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const token = localStorage.getItem('authToken');
      
//       if (!token) {
//         navigate('/login');
//         return;
//       }

//       try {
//         const response = await fetch('http://127.0.0.1:8000/api/user', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Accept': 'application/json',
//           },
//         });
//         console.log(response);
//         if (!response.ok) {
//           throw new Error('Failed to fetch user data');
//         }

//         const data = await response.json();
//         setUserData(data);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [navigate]);

//   const handleLogout = async () => {
//     const token = localStorage.getItem('authToken');
    
//     try {
//       const response = await fetch('http://127.0.0.1:8000/api/logout', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Accept': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Logout failed');
//       }

//       // Clear the auth token
//       localStorage.removeItem('authToken');
      
//       // Redirect to login page
//       navigate('/login');
//     } catch (error) {
//       console.error('Logout error:', error);
//       // Even if the API call fails, we still want to clear the token and redirect
//       localStorage.removeItem('authToken');
//       navigate('/login');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="profile-container">
//         <div className="loading-spinner">
//           <div className="spinner"></div>
//           <p>Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="profile-container">
//         <div className="error-message">
//           <p>{error}</p>
//           <button onClick={() => navigate('/login')}>Back to Login</button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="profile-container">
//       <div className="profile-wrapper">
//         <div className="profile-header">
//           <h2>Profile</h2>
//           <button onClick={handleLogout} className="logout-button">
//             Logout
//           </button>
//         </div>

//         <div className="profile-content">
//           {userData && (
//             <>
//               <div className="profile-info">
//                 <div className="info-item">
//                   <span className="label">Name:</span>
//                   <span className="value">{userData.name}</span>
//                 </div>
//                 <div className="info-item">
//                   <span className="label">Email:</span>
//                   <span className="value">{userData.email}</span>
//                 </div>
//                 <div className="info-item">
//                   <span className="label">Mobile:</span>
//                   <span className="value">{userData.number}</span>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//         <LeftSideBar />
//       </div>
//     </div>
//   );
// };

// export default Profile;

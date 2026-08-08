import React, { useState, useEffect } from "react";
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import "./css/HomeUiResident.css";
import Notices from './NoticesResident'; 
import Posts from './PostsResident'; 
import Parking from './ParkingResident'; 
import { Calendar, Cog, AlertCircle, Bell, Pen, Phone, FileText, LogOut, ParkingSquare, LayoutDashboard, User, Search } from 'lucide-react';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from './ServiceResident/apiResident.js';
import RazorpayPayment from './PaymentPage.jsx'; // Adjust the path as needed
import logo from "./assets/Natural Care Logo.jpg";

import { API_ROUTES } from "../../config/api.routes.js";
import { redirect } from "react-router-dom";

// CSS styles
const styles = `
  /* Previous styles remain the same */
  .resident-list-container {
    margin-top: 1.5rem;
  }
  .filter-controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    align-items: center;
  }
  .search-input {
    padding: 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    flex-grow: 1;
    max-width: 300px;
  }
  .block-filter {
    display: flex;
    gap: 0.5rem;
  }
  .block-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    cursor: pointer;
    background: white;
  }
  .block-btn.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }
  .resident-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }
  .resident-card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
  }
  .resident-card h3 {
    margin-bottom: 0.5rem;
    color: #3b82f6;
  }
  .resident-card p {
    margin: 0.25rem 0;
    color: #4b5563;
  }
  .loading-spinner {
    display: flex;
    justify-content: center;
    padding: 20px;
    color: #3b82f6;
  }
  .error-message {
    background-color: #fee2e2;
    color: #dc2626;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 15px;
    text-align: center;
  }
`;

// Main component
function HomeUI() {
  const [activeSection, setActiveSection] = useState("dashboard-section");
  const [activeBlock, setActiveBlock] = useState('A','B');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [residents, setResidents] = useState([]);
  const [filteredResidents, setFilteredResidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingResidents, setIsLoadingResidents] = useState(false);
  const [residentError, setResidentError] = useState(null);

  

  // Event states
  const [eventFormData, setEventFormData] = useState({
    title: '',
    start: '',
    end: '',
    description: '',
    allDay: true,
    imageUrl: ''
  });
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

   // Request Services State
   const [serviceRequests, setServiceRequests] = useState([]);
   const [isLoadingRequests, setIsLoadingRequests] = useState(false);
   const [requestError, setRequestError] = useState(null);
   const [serviceFormData, setServiceFormData] = useState({
    serviceType: 'Water Can',
    name: userData?.name || '',
    address: '',
    phoneNo: '',
    additionalNotes: ''
  });
  console.log("Current user data:", userData);
console.log("Current service requests:", serviceRequests);

  // Complaint states
const [complaints, setComplaints] = useState([]);
const [isLoadingComplaints, setIsLoadingComplaints] = useState(false);
const [complaintError, setComplaintError] = useState(null);
const [complaintFormData, setComplaintFormData] = useState({
  name: userData?.name || '',
  title: '',
  description: '',
  block: userData?.block || '',
  flatNo: userData?.flatNo || '',
  status: 'Pending'
});
const [complaintStats, setComplaintStats] = useState({
  total: 0,
  solved: 0,
  pending: 0,
  blockA: 0,
  blockB: 0
});

//billing : 
const [paymentHistory, setPaymentHistory] = useState([]);
  
  // API states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user data from localStorage
  useEffect(async () => {
    if (token){
        try{
            const response =await fetch(API_ROUTES.AUTH.ME ,{
              method:"GET",
              headers:{'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,},
            } 
            )

            console.log(response)
             if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch user daata:", errorText);
        return;
      }
      const data = await response.json();
      console.log(data)

          }catch(error){
            print(error , "something went wrong !!!")
          }
    }else{
        redirect("/login")
    }

    userEmail = data.email;
    userRole = data.role;

    if (userEmail && userRole) {
      setUserData({  email: userEmail, role: userRole });
    }
  }, []);

  // Fetch residents from backend
  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/user/residents');
        setResidents(response.data);
        setFilteredResidents(response.data); // Initialize with all residents
      } catch (error) {
        console.error("Error fetching residents:", error);
      }
    };
    
    fetchResidents();
  }, []);

  
  // Filter residents when block or search term changes
  useEffect(() => {
    let results = residents;
    
    // Filter by block
    if (activeBlock) {
      results = results.filter(resident => 
        resident.residentDetails?.block === activeBlock
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(resident =>
        resident.email.toLowerCase().includes(term) ||
        (resident.residentDetails?.name && 
         resident.residentDetails.name.toLowerCase().includes(term))
      );
    }
    
    setFilteredResidents(results);
  }, [residents, activeBlock, searchTerm]);


  // Removed duplicate declaration of handleSearchChange

  //resident section : 

  // Fetch user data from localStorage
  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    const userEmail = localStorage.getItem("userEmail");
    const userRole = localStorage.getItem("userRole");

    if (storedUserData && userEmail && userRole) {
      setUserData({ ...storedUserData, email: userEmail, role: userRole });
    }
  }, []);

  // Filter residents when block or search term changes
  useEffect(() => {
    let results = residents;
    
    if (activeBlock) {
      results = results.filter(resident => 
        resident.residentDetails?.block === activeBlock
      );
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(resident =>
        resident.email.toLowerCase().includes(term) ||
        (resident.residentDetails?.name && 
         resident.residentDetails.name.toLowerCase().includes(term))
      );
    }
    
    setFilteredResidents(results);
  }, [residents, activeBlock, searchTerm]);

  // Fetch service requests when service section is active
  useEffect(() => {
    const fetchServiceRequests = async () => {
      if (activeSection !== "request-services-section") return;
      
      setIsLoadingRequests(true);
      setRequestError(null);
      try {
        const response = await axios.get(
          'http://localhost:8080/service-requests/all-services',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        setServiceRequests(response.data);
      } catch (err) {
        setRequestError('Failed to load service requests. Please try again later.');
        console.error('Error fetching service requests:', err);
      } finally {
        setIsLoadingRequests(false);
      }
    };
    
    fetchServiceRequests();
  }, [activeSection]);



  // Fetch events from backend
  useEffect(() => {
    const loadEvents = async () => {
      if (activeSection !== "events-section") return;
      
      setIsLoading(true);
      setError(null);
      try {
        const events = await fetchEvents();
        setEvents(events);
      } catch (err) {
        setError('Failed to load events. Please try again later.');
        console.error('Error fetching events:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, [activeSection]);


  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };


  // Event handlers
  const handleDateClick = (arg) => {
    setShowEventForm(true);
    setSelectedEvent(null);
    setEventFormData({
      title: '',
      start: arg.dateStr,
      end: '',
      description: '',
      allDay: true,
      imageUrl: ''  // Make sure this is included
    });
  };
  

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setShowEventDetails(true);
  };



  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    if (sectionId !== "dashboard-section") {
      setActiveBlock(null);
    }
  };



  //edit dashboard form :

const fetchResidents = async () => {
  setIsLoadingResidents(true);
  setResidentError(null);
  try {
    const response = await axios.get('http://localhost:8080/api/user/residents');
    const residentsData = response.data.map(user => ({
      ...user,
      name: user.residentDetails?.name || user.email.split('@')[0],
      block: user.residentDetails?.block || 'N/A',
      flatNo: user.residentDetails?.flatNo || 'N/A',
      phone: user.residentDetails?.phone || 'N/A'
    }));
    setResidents(residentsData);
    setFilteredResidents(residentsData);
  } catch (err) {
    setResidentError('Failed to load residents. Please try again later.');
    console.error('Error fetching residents:', err);
  } finally {
    setIsLoadingResidents(false);
  }
};

//request service section :
const handleSearchChange = (e) => {
  setSearchTerm(e.target.value);
};

const handleServiceFormChange = (e) => {
  const { name, value } = e.target;
  setServiceFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

  //request service section :

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoadingRequests(true);
      setRequestError(null);
      
      // Debug: Log current form data
      console.log('Submitting form data:', serviceFormData);
      
      // Validate required fields
      const requiredFields = ['serviceType', 'name', 'address', 'phoneNo'];
      const missingFields = requiredFields.filter(field => !serviceFormData[field]?.trim());
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
  
      // Validate phone number format
      if (!/^\d{10}$/.test(serviceFormData.phoneNo)) {
        throw new Error('Phone number must be 10 digits');
      }
  
      const response = await axios.post(
        'http://localhost:8080/service-requests/add-services', 
        serviceFormData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
  
      if ([200, 201].includes(response.status)) {
        // Refresh the requests list
        const { data } = await axios.get(
          'http://localhost:8080/service-requests/all-services',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        
        setServiceRequests(data);
        setServiceFormData({
          serviceType: 'Water Can',
          name: userData?.name || '',
          address: '',
          phoneNo: '',
          additionalNotes: ''
        });
        alert('Service request submitted successfully!');
      } else {
        throw new Error(response.data?.message || 'Unexpected response from server');
      }
    } catch (err) {
      console.error('Error submitting request:', err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to submit request. Please check all fields.';
      setRequestError(errorMessage);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  // Add this near your other useEffect hooks
  useEffect(() => {
    const fetchServiceRequests = async () => {
      if (activeSection !== "request-services-section") return;
      
      setIsLoadingRequests(true);
      setRequestError(null);
      try {
        const response = await axios.get(
          'http://localhost:8080/service-requests/all-services',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            params: {
              residentId: userData?.id // Add this if your backend filters by resident
            }
          }
        );
        
        // Debug log to check what's being returned
        console.log("Service requests data:", response.data);
        
        setServiceRequests(response.data);
      } catch (err) {
        console.error("Full error:", err);
        setRequestError(err.response?.data?.message || 'Failed to load service requests');
      } finally {
        setIsLoadingRequests(false);
      }
    };
    
    fetchServiceRequests();
  }, [activeSection, userData?.id]); // Add userData.id as dependency

const fetchServiceRequests = async () => {
  setIsLoadingRequests(true);
  setRequestError(null);
  try {
    const response = await axios.get(
      'http://localhost:8080/service-requests/all-services',
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );
    setServiceRequests(response.data);
  } catch (err) {
    setRequestError('Failed to load service requests. Please try again later.');
    console.error('Error fetching service requests:', err);
  } finally {
    setIsLoadingRequests(false);
  }
};

  //complaint section : 
  useEffect(() => {
    const fetchComplaints = async () => {
      if (activeSection !== "complaints-section") return;
      
      setIsLoadingComplaints(true);
      setComplaintError(null);
      try {
        const response = await axios.get(
          'http://localhost:8080/api/complaints',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        setComplaints(response.data);
      } catch (err) {
        setComplaintError('Failed to load complaints. Please try again later.');
        console.error('Error fetching complaints:', err);
      } finally {
        setIsLoadingComplaints(false);
      }
    };
    
    fetchComplaints(); // Actually call the function
  }, [activeSection]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8080/api/complaints/stats',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        setComplaintStats(response.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    
    if (activeSection === "complaints-section") {
      fetchStats();
    }
  }, [activeSection]);

  const handleComplaintFormChange = (e) => {
    const { name, value } = e.target;
    setComplaintFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoadingComplaints(true);
      setComplaintError(null);
      
      if (!complaintFormData.title || !complaintFormData.description) {
        throw new Error('Title and description are required');
      }
  
      const response = await axios.post(
        'http://localhost:8080/api/complaints',
        {
          name: complaintFormData.name,
          email: userData?.email || '',
          title: complaintFormData.title,
          description: complaintFormData.description,
          block: complaintFormData.block,
          flatNo: complaintFormData.flatNo,
          status: 'Pending' // Default status
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
  
      if ([200, 201].includes(response.status)) {
        // Refresh the complaints list
        const { data } = await axios.get(
          'http://localhost:8080/api/complaints',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        
        setComplaints(data);
        setComplaintFormData(prev => ({
          ...prev,
          title: '',
          description: ''
        }));
        alert('Complaint submitted successfully!');
      }
    } catch (err) {
      setComplaintError(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setIsLoadingComplaints(false);
    }
  };
  
  // Helper function to count complaints
  const countComplaints = () => {
    const total = complaints.length;
    const solved = complaints.filter(c => c.status === 'Solved').length;
    const unsolved = total - solved;
    const blockA = complaints.filter(c => c.block === 'A').length;
    const blockB = complaints.filter(c => c.block === 'B').length;
    
    return { total, solved, unsolved, blockA, blockB };
  };
  
  const complaintCounts = countComplaints();

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/complaints');
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      // Optional: Show error to user
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/complaints/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Optional: Show error to user
    }
  };

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/complaints/${complaintId}/status`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      // Refresh complaints list
      const { data } = await axios.get(
        'http://localhost:8080/api/complaints',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      setComplaints(data);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };


  //payment :
  const [bills, setBills] = useState([
    {
      id: 1,
      type: 'Maintenance',
      amount: 2500,
      dueDate: '15th Apr 2023',
      paid: false
    },
    {
      id: 2,
      type: 'Water Bill',
      amount: 800,
      dueDate: '20th Apr 2023',
      paid: false
    },
    {
      id: 3,
      type: 'Electricity (Common)',
      amount: 350,
      dueDate: '25th Apr 2023',
      paid: false
    }
  ]);
  
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  
  // Add this payment handler function
  const handlePaymentSuccess = (response, billId) => {
    console.log('Payment successful:', response);
    setPaymentSuccess(true);
    
    // Update the bill status
    setBills(prevBills => 
      prevBills.map(bill => 
        bill.id === billId ? { ...bill, paid: true } : bill
      )
    );
    
    setSelectedBill(null);
    
    // Show success message for 3 seconds
    setTimeout(() => {
      setPaymentSuccess(false);
    }, 3000);
  };

  // Fetch bills for resident
const fetchBills = async (residentId) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/bills/resident/${residentId}`);
    setBills(response.data);
  } catch (error) {
    console.error("Error fetching bills:", error);
  }
};

// Process payment
const handlePayment = async (billId, amount, paymentResponse) => {
  try {
    const paymentData = {
      billId,
      residentId: userData.id, // Assuming userData contains the resident ID
      amount,
      paymentMethod: "Razorpay",
      transactionId: paymentResponse.razorpay_payment_id
    };
    
    const response = await axios.post('http://localhost:8080/api/bills/pay', paymentData);
    console.log("Payment processed:", response.data);
    setPaymentSuccess(true);
    
    // Refresh bills
    fetchBills(userData.id);
  } catch (error) {
    console.error("Payment processing failed:", error);
  }
};

useEffect(() => {
  if (activeSection === "billings-section" && userData?.id) {
    const fetchBillingData = async () => {
      try {
        // Fetch bills
        const billsResponse = await axios.get(
          `http://localhost:8080/api/bills/resident/${userData.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        setBills(billsResponse.data);
        
        // Fetch payment history
        const paymentsResponse = await axios.get(
          `http://localhost:8080/api/payments/resident/${userData.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        setPaymentHistory(paymentsResponse.data);
      } catch (error) {
        console.error("Error fetching billing data:", error);
      }
    };
    
    fetchBillingData();
  }
}, [activeSection, userData]);

  const getSectionTitle = () => {
    switch (activeSection) {
      case "dashboard-section": return "Residents of the society";
      case "request-services-section": return "Request Services";
      case "complaints-section": return "Complaints";
      case "events-section": return "Events";
      case "notices-section": return "Notices";
      case "posts-section": return "Posts";
      case "parking-section": return "Parking";
      case "emergency-contacts-section": return "Emergency Contacts";
      case "billings-section": return "Billings";
      case "logout-section": return "Logout";
      default: return "Dashboard";
    }
  };

  return (
    <>
      {/* Tailwind CSS classes applied directly */}
      <div className="flex h-screen w-full overflow-hidden bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 min-w-[16rem] bg-white h-screen shadow-sm flex-shrink-0 overflow-y-auto border-r border-gray-200 z-10 fixed md:relative">
          <div className="flex items-center justify-center py-7 border-b border-gray-200">
            <img src={logo || "/placeholder.svg"} alt="Logo" className="h-12" />
          </div>
          <nav className="py-6">
            <NavItem
              icon={<LayoutDashboard />}
              title="Dashboard"
              isActive={activeSection === "dashboard-section"}
              onClick={() => handleNavClick("dashboard-section")}
            />
            <NavItem
              icon={<Cog />}
              title="Request Services"
              isActive={activeSection === "request-services-section"}
              onClick={() => handleNavClick("request-services-section")}
            />
            <NavItem
              icon={<AlertCircle />}
              title="Complaints"
              isActive={activeSection === "complaints-section"}
              onClick={() => handleNavClick("complaints-section")}
            />
            <NavItem
              icon={<Calendar />}
              title="Events"
              isActive={activeSection === "events-section"}
              onClick={() => handleNavClick("events-section")}
            />
            <NavItem
              icon={<Bell />}
              title="Notices"
              isActive={activeSection === "notices-section"}
              onClick={() => handleNavClick("notices-section")}
            />
            <NavItem
              icon={<Pen />}
              title="Posts"
              isActive={activeSection === "posts-section"}
              onClick={() => handleNavClick("posts-section")}
            />
            <NavItem
              icon={<ParkingSquare />}
              title="Parking"
              isActive={activeSection === "parking-section"}
              onClick={() => handleNavClick("parking-section")}
            />
            <NavItem
              icon={<Phone />}
              title="Emergency Contacts"
              isActive={activeSection === "emergency-contacts-section"}
              onClick={() => handleNavClick("emergency-contacts-section")}
            />
            <NavItem
              icon={<FileText />}
              title="Billings"
              isActive={activeSection === "billings-section"}
              onClick={() => handleNavClick("billings-section")}
            />
            <NavItem
              icon={<LogOut />}
              title="Logout"
              isActive={activeSection === "logout-section"}
              onClick={() => handleNavClick("logout-section")}
            />
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto w-full ml-0 md:ml-0">
          <div className="p-6 w-full max-w-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm w-full sticky top-0 z-10">
              <h1 className="text-xl font-bold">{getSectionTitle()}</h1>
              <div className="flex items-center cursor-pointer" onClick={() => setIsProfileOpen(true)}>
                <span className="mr-4">{userData ? userData.name : "User"}</span>
                <User className="h-6 w-6" />
              </div>
            </div>

            {/* Dashboard Section */}
            {activeSection === "dashboard-section" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">Residents of the Society</h2>

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Apartments</h3>
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                      <div className="relative w-full md:max-w-xs">
                        <Search
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <input
                          type="text"
                          placeholder="Search residents..."
                          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={searchTerm}
                          onChange={handleSearchChange}
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          className={`px-4 py-2 rounded-md transition-colors ${
                            activeBlock === "A"
                              ? "bg-blue-600 text-white"
                              : "bg-white border border-gray-300 hover:bg-gray-100"
                          }`}
                          onClick={() => setActiveBlock("A")}
                        >
                          Block A
                        </button>
                        <button
                          className={`px-4 py-2 rounded-md transition-colors ${
                            activeBlock === "B"
                              ? "bg-blue-600 text-white"
                              : "bg-white border border-gray-300 hover:bg-gray-100"
                          }`}
                          onClick={() => setActiveBlock("B")}
                        >
                          Block B
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Residents List */}
                  <div className="mt-6">
                    {isLoadingResidents ? (
                      <div className="flex justify-center py-8 text-blue-600">Loading residents...</div>
                    ) : residentError ? (
                      <div className="bg-red-100 text-red-600 p-4 rounded-md text-center mb-4">
                        {residentError}
                        <button onClick={fetchResidents} className="ml-2 underline">
                          Retry
                        </button>
                      </div>
                    ) : filteredResidents.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredResidents.map((resident) => (
                          <div
                            key={resident.id}
                            className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                          >
                            <h3 className="text-lg font-semibold text-blue-600 mb-2">
                              {resident.residentDetails?.name || resident.email.split("@")[0]}
                            </h3>
                            <p className="mb-1">
                              <span className="font-semibold">Email:</span> {resident.email}
                            </p>
                            <p className="mb-1">
                              <span className="font-semibold">Block:</span> {resident.residentDetails?.block || "N/A"}
                            </p>
                            <p className="mb-1">
                              <span className="font-semibold">Flat No:</span>{" "}
                              {resident.residentDetails?.flatNo || "N/A"}
                            </p>
                            <p className="mb-1">
                              <span className="font-semibold">Phone:</span> {resident.residentDetails?.phone || "N/A"}
                            </p>
                            <p className="mb-3">
                              <span className="font-semibold">Role:</span> {resident.role}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">No residents found in Block {activeBlock}</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Complaints Section */}
            {activeSection === "complaints-section" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                  <div className="p-5 rounded-lg bg-blue-50 border-l-4 border-blue-500 flex flex-col">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{complaintStats.total}</div>
                    <div className="text-gray-600">Total Complaints</div>
                  </div>
                  <div className="p-5 rounded-lg bg-green-50 border-l-4 border-green-500 flex flex-col">
                    <div className="text-3xl font-bold text-green-600 mb-2">{complaintStats.solved}</div>
                    <div className="text-gray-600">Solved</div>
                  </div>
                  <div className="p-5 rounded-lg bg-amber-50 border-l-4 border-amber-500 flex flex-col">
                    <div className="text-3xl font-bold text-amber-600 mb-2">{complaintStats.pending}</div>
                    <div className="text-gray-600">Pending</div>
                  </div>
                  <div className="p-5 rounded-lg bg-purple-50 border-l-4 border-purple-500 flex flex-col">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{complaintStats.blockA}</div>
                    <div className="text-gray-600">Block A</div>
                  </div>
                  <div className="p-5 rounded-lg bg-blue-100 border-l-4 border-blue-800 flex flex-col">
                    <div className="text-3xl font-bold text-blue-800 mb-2">{complaintStats.blockB}</div>
                    <div className="text-gray-600">Block B</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">Submit Complaint</h2>
                  {complaintError && (
                    <div className="bg-red-100 text-red-600 p-4 rounded-md text-center mb-4">
                      {complaintError}
                    </div>
                  )}
                  <form onSubmit={handleComplaintSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                      <label className="font-medium text-gray-700" htmlFor="name">
                        Name
                      </label>
                      <input
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="name"
                        name="name"
                        placeholder="Enter your Name here"
                        type="text"
                        value={complaintFormData.name}
                        onChange={handleComplaintFormChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="font-medium text-gray-700" htmlFor="title">
                        Title *
                      </label>
                      <input
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="title"
                        name="title"
                        placeholder="Enter the Title here"
                        type="text"
                        value={complaintFormData.title}
                        onChange={handleComplaintFormChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="font-medium text-gray-700" htmlFor="description">
                        Description *
                      </label>
                      <textarea
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="description"
                        name="description"
                        placeholder="Enter the Description here"
                        value={complaintFormData.description}
                        onChange={handleComplaintFormChange}
                        required
                        rows={4}
                      ></textarea>
                    </div>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      type="submit"
                      disabled={isLoadingComplaints}
                    >
                      {isLoadingComplaints ? 'Submitting...' : 'Submit'}
                    </button>
                  </form>
                </div>

                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-4">My Complaints</h2>
                  {isLoadingComplaints ? (
                    <div className="flex justify-center py-8 text-blue-600">Loading complaints...</div>
                  ) : complaintError ? (
                    <div className="bg-red-100 text-red-600 p-4 rounded-md text-center mb-4">
                      {complaintError}
                      <button onClick={() => window.location.reload()} className="ml-2 underline">
                        Retry
                      </button>
                    </div>
                  ) : complaints.filter(complaint => complaint.email === (userData?.email || '')).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {complaints
                        .filter(complaint => complaint.email === (userData?.email || ''))
                        .map((complaint) => (
                          <div
                            key={complaint.id}
                            className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                          >
                            <h3 className="text-lg font-semibold text-blue-600 mb-2">{complaint.title}</h3>
                            <p className="mb-1">
                              <span className="font-semibold">Submitted by:</span> {complaint.name}
                            </p>
                            <p className="mb-1">
                              <span className="font-semibold">Date:</span>{" "}
                              {new Date(complaint.createdAt).toLocaleString()}
                            </p>
                            <p className="mb-1">
                              <span className="font-semibold">Description:</span> {complaint.description}
                            </p>
                            <p className="mb-2">
                              <span className="font-semibold">Status:</span>
                              <span
                                className={`inline-block px-2 py-1 rounded-md text-sm font-medium ${
                                  complaint.status === "Pending"
                                    ? "bg-amber-100 text-amber-800"
                                    : complaint.status === "In Progress"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-green-100 text-green-800"
                                }`}
                              >
                                {complaint.status}
                              </span>
                            </p>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-gray-500">No complaints found.</p>
                  )}
                </div>
              </div>
            )}

            {/* Request Services Section */}
            {activeSection === "request-services-section" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">Submit Service Request</h2>
                  {requestError && (
                    <div className="bg-red-100 text-red-600 p-4 rounded-md text-center mb-4">
                      {requestError}
                    </div>
                  )}
                  <form onSubmit={handleServiceSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                      <label className="font-medium text-gray-700" htmlFor="serviceType">
                        Select Service Type *
                      </label>
                      <select 
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        id="serviceType"
                        name="serviceType"
                        value={serviceFormData.serviceType}
                        onChange={handleServiceFormChange}
                        required
                      >
                        <option value="Water Can">Water Can</option>
                        <option value="House Keeping">House Keeping</option>
                        <option value="Gas">Gas</option>
                        <option value="Plumbing">Plumbing</option>
                        <option value="Garbage Collection">Garbage Collection</option>
                      </select>
                    </div>

                    <div className="grid gap-2">
                      <label className="font-medium text-gray-700" htmlFor="name">
                        Your Name *
                      </label>
                      <input
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        type="text"
                        value={serviceFormData.name}
                        onChange={handleServiceFormChange}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <label className="font-medium text-gray-700" htmlFor="address">
                        Address *
                      </label>
                      <input
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="address"
                        name="address"
                        placeholder="Enter your Address here"
                        type="text"
                        value={serviceFormData.address}
                        onChange={handleServiceFormChange}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <label className="font-medium text-gray-700" htmlFor="phoneNo">
                        Phone Number *
                      </label>
                      <input
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="phoneNo"
                        name="phoneNo"
                        placeholder="Enter your phone number"
                        type="tel"
                        value={serviceFormData.phoneNo}
                        onChange={handleServiceFormChange}
                        required
                        pattern="[0-9]{10}"
                        title="Please enter a 10-digit phone number"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label className="font-medium text-gray-700" htmlFor="additionalNotes">
                        Additional Notes
                      </label>
                      <textarea
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="additionalNotes"
                        name="additionalNotes"
                        placeholder="Any specific details"
                        value={serviceFormData.additionalNotes}
                        onChange={handleServiceFormChange}
                        rows={4}
                      ></textarea>
                    </div>

                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      type="submit"
                      disabled={isLoadingRequests}
                    >
                      {isLoadingRequests ? 'Submitting...' : 'Send Request'}
                    </button>
                  </form>
                </div>
                
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">My Service Requests</h2>
                    <button 
                      onClick={fetchServiceRequests} 
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                      disabled={isLoadingRequests}
                    >
                      {isLoadingRequests ? 'Refreshing...' : 'Refresh'}
                    </button>
                  </div>

                  {isLoadingRequests ? (
                    <div className="flex justify-center py-8 text-blue-600">Loading requests...</div>
                  ) : requestError ? (
                    <div className="bg-red-100 text-red-600 p-4 rounded-md text-center mb-4">
                      {requestError}
                      <button onClick={fetchServiceRequests} className="ml-2 underline">
                        Retry
                      </button>
                    </div>
                  ) : serviceRequests.filter(r => r.name === userData?.name).length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No service requests found.</p>
                      <p>Submit a request using the form above.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {serviceRequests
                        .filter(request => 
                          request.name === userData?.name || 
                          request.email === userData?.email ||
                          request.residentId === userData?.id
                        )
                        .map((request) => (
                          <div
                            key={request._id || request.id}
                            className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                          >
                            <h3 className="text-lg font-semibold text-blue-600 mb-2">{request.serviceType || 'Service Request'}</h3>
                            <p className="mb-1">
                              <span className="font-semibold">Status:</span>
                              <span
                                className={`inline-block px-2 py-1 ml-2 rounded-md text-sm font-medium ${
                                  request.status === "Pending"
                                    ? "bg-amber-100 text-amber-800"
                                    : request.status === "Approved"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {request.status || 'Pending'}
                              </span>
                            </p>
                            <p className="mb-1">
                              <span className="font-semibold">Submitted:</span> {new Date(request.createdAt).toLocaleString()}
                            </p>
                            
                            {request.address && <p className="mb-1"><span className="font-semibold">Address:</span> {request.address}</p>}
                            {request.phoneNo && <p className="mb-1"><span className="font-semibold">Phone:</span> {request.phoneNo}</p>}
                            {request.additionalNotes && <p className="mb-1"><span className="font-semibold">Notes:</span> {request.additionalNotes}</p>}
                            
                            {request.status === 'Approved' && request.adminNotes && (
                              <div className="mt-3 p-3 bg-green-50 rounded-md">
                                <p><span className="font-semibold">Admin Response:</span> {request.adminNotes}</p>
                                {request.approvalDate && (
                                  <p className="text-sm text-gray-500 mt-1">Approved on: {new Date(request.approvalDate).toLocaleString()}</p>
                                )}
                              </div>
                            )}
                            
                            {request.status === 'Rejected' && request.rejectionReason && (
                              <div className="mt-3 p-3 bg-red-50 rounded-md">
                                <p><span className="font-semibold">Reason for Rejection:</span> {request.rejectionReason}</p>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Events Section */}
            {activeSection === "events-section" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                {isLoading && <div className="flex justify-center py-8 text-blue-600">Loading events...</div>}
                {error && <div className="bg-red-100 text-red-600 p-4 rounded-md text-center mb-4">{error}</div>}
                
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Society Events</h2>
                </div>

                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                  initialView="dayGridMonth"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                  }}
                  events={events}
                  editable={true}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={true}
                  weekends={true}
                  dateClick={handleDateClick}
                  eventClick={handleEventClick}
                  height="auto"
                />

                {/* Event Details Modal */}
                {showEventDetails && selectedEvent && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-md">
                      {selectedEvent.extendedProps?.imageUrl && (
                        <div className="mb-4">
                          <img 
                            src={selectedEvent.extendedProps.imageUrl || "/placeholder.svg"} 
                            alt={selectedEvent.title}
                            className="max-w-full max-h-48 rounded object-cover mx-auto"
                          />
                        </div>
                      )}
                      
                      <h2 className="text-xl font-bold mb-4">{selectedEvent.title}</h2>
                      <p className="mb-2">
                        <span className="font-semibold">Date:</span>{" "}
                        {new Date(selectedEvent.start).toLocaleDateString()}
                        {selectedEvent.end && ` to ${new Date(selectedEvent.end).toLocaleDateString()}`}
                      </p>
                      {selectedEvent.extendedProps?.description && (
                        <p className="mb-6">
                          <span className="font-semibold">Description:</span>{" "}
                          {selectedEvent.extendedProps.description}
                        </p>
                      )}
                      
                      <div className="flex justify-end gap-2">
                        <button
                          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                          onClick={() => setShowEventDetails(false)}
                          disabled={isLoading}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notices Section */}
            {activeSection === "notices-section" && <Notices />}

            {/* Posts Section */}
            {activeSection === "posts-section" && <Posts />}

            {/* Parking Section */}
            {activeSection === "parking-section" && <Parking />}

            {/* Emergency Contacts Section */}
            {activeSection === "emergency-contacts-section" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6">Emergency Contacts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                    <h3 className="font-semibold mb-2">Fire Department</h3>
                    <p>Phone: 101</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <h3 className="font-semibold mb-2">Police</h3>
                    <p>Phone: 100</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    <h3 className="font-semibold mb-2">Ambulance</h3>
                    <p>Phone: 102</p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
                    <h3 className="font-semibold mb-2">Society Security</h3>
                    <p>Phone: 9876543210</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                    <h3 className="font-semibold mb-2">Maintenance</h3>
                    <p>Phone: 9876543211</p>
                  </div>
                </div>
              </div>
            )}

            {/* Billings Section */}
            {activeSection === "billings-section" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Billing Information</h2>
                
                {paymentSuccess && (
                  <div className="bg-green-100 text-green-800 p-4 rounded-md text-center mb-4">
                    Payment successful! Thank you for your payment.
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="font-bold mb-2">Current Month</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bills.map((bill) => (
                      <div 
                        key={bill.id} 
                        className={`p-4 rounded-lg ${bill.paid ? 'bg-gray-50' : 'bg-blue-50'}`}
                      >
                        <h4 className="font-semibold mb-2">{bill.type}</h4>
                        <p className="text-2xl font-bold mb-1">₹{bill.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-600 mb-3">Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
                        
                        {bill.paid ? (
                          <div className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm font-medium">
                            Paid
                          </div>
                        ) : (
                          <RazorpayPayment
                            amount={bill.amount}
                            description={`Payment for ${bill.type}`}
                            billId={bill.id}
                            residentId={userData.id}
                            onSuccess={(response, billId) => {
                              setBills(prev => prev.map(b => 
                                b.id === billId ? {...b, paid: true} : b
                              ));
                            }}
                            onClose={() => console.log('Payment closed')}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-bold mb-4">Payment History</h3>
                  {paymentHistory.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Bill Type
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Transaction ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {paymentHistory.map(payment => (
                            <tr key={payment.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(payment.paymentDate).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ₹{payment.amount}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {bills.find(bill => bill.id === payment.billId)?.type || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {payment.transactionId}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-block px-2 py-1 rounded-md text-sm font-medium ${
                                  payment.status === "Successful" 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-red-100 text-red-800"
                                }`}>
                                  {payment.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center py-4 text-gray-500">No payment history available</p>
                  )}
                </div>
              </div>
            )}

            {/* Logout Section */}
            {activeSection === "logout-section" && (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <h2 className="text-xl font-bold mb-6">Are you sure you want to logout?</h2>
                <div className="flex justify-center gap-4">
                  <button
                    className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    onClick={handleLogout}
                  >
                    Yes, Logout
                  </button>
                  <button
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    onClick={() => handleNavClick("dashboard-section")}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {isProfileOpen && userData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center">Welcome, {userData.name}!</h2>
            <p className="mb-1">
              <span className="font-semibold">Email:</span> {userData.email}
            </p>
            <p className="mb-1">
              <span className="font-semibold">Role:</span> {userData.role}
            </p>
            <p className="mb-1">
              <span className="font-semibold">Phone:</span> {userData.phone || "Not provided"}
            </p>
            {userData.societyId && (
              <p className="mb-1">
                <span className="font-semibold">Society ID:</span> {userData.societyId}
              </p>
            )}
            {userData.societyName && (
              <p className="mb-1">
                <span className="font-semibold">Society Name:</span> {userData.societyName}
              </p>
            )}

            {userData.role === "Admin" ? (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-2">Admin Profile</h3>
                {userData.societyAddress && (
                  <p className="mb-1">
                    <span className="font-semibold">Society Address:</span> {userData.societyAddress}
                  </p>
                )}
                {userData.city && (
                  <p className="mb-1">
                    <span className="font-semibold">City:</span> {userData.city}
                  </p>
                )}
                {userData.district && (
                  <p className="mb-1">
                    <span className="font-semibold">District:</span> {userData.district}
                  </p>
                )}
                {userData.postal && (
                  <p className="mb-1">
                    <span className="font-semibold">Postal Code:</span> {userData.postal}
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-2">Resident Profile</h3>
                {userData.flatNo && (
                  <p className="mb-1">
                    <span className="font-semibold">Flat No:</span> {userData.flatNo}
                  </p>
                )}
                {userData.block && (
                  <p className="mb-1">
                    <span className="font-semibold">Block:</span> {userData.block}
                  </p>
                )}
                {userData.postal && (
                  <p className="mb-1">
                    <span className="font-semibold">Postal Code:</span> {userData.postal}
                  </p>
                )}
              </div>
            )}

<button
              onClick={() => setIsProfileOpen(false)}
              className="mt-6 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
} // This closes the HomeUI component

// Navigation Item Component - now properly outside the HomeUI component
function NavItem({ icon, title, isActive, onClick }) {
  return (
    <button
      className={`flex items-center gap-3 px-6 py-3 w-full text-left transition-colors ${
        isActive ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600" : "text-gray-600 hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span>{title}</span>
    </button>
  );
}

export default HomeUI;
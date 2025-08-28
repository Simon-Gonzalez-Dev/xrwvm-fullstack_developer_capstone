import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';
import review_icon from "../assets/reviewicon.png"

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  // let [state, setState] = useState("")
  const [states, setStates] = useState([])

  // let root_url = window.location.origin
  let dealer_url ="/djangoapp/get_dealers";
  
  let dealer_url_by_state = "/djangoapp/get_dealers/";
 
  const filterDealers = async (state) => {
    console.log('filterDealers called with state:', state);
    
    if (state === "All") {
      console.log('Showing all dealers');
      get_dealers();
      return;
    }
    
    try {
      const url = dealer_url_by_state + state;
      console.log('Fetching from URL:', url);
      
      const res = await fetch(url, {
        method: "GET"
      });
      const retobj = await res.json();
      console.log('Response:', retobj);
      
      if(retobj.status === 200) {
        let state_dealers = Array.from(retobj.dealers)
        console.log('Setting dealers list:', state_dealers);
        setDealersList(state_dealers)
      } else {
        console.error('Error filtering dealers:', retobj.message);
      }
    } catch (error) {
      console.error('Error filtering dealers:', error);
    }
  }

  const get_dealers = async ()=>{
    try {
      const res = await fetch(dealer_url, {
        method: "GET"
      });
      const retobj = await res.json();
      if(retobj.status === 200) {
        let all_dealers = Array.from(retobj.dealers)
        let states = [];
        all_dealers.forEach((dealer)=>{
          states.push(dealer.state)
        });

        const uniqueStates = Array.from(new Set(states));
        console.log('Available states:', uniqueStates);
        console.log('All dealers:', all_dealers);
        
        setStates(uniqueStates)
        setDealersList(all_dealers)
        
        console.log('States state after setStates:', uniqueStates);
      } else {
        console.error('Error fetching dealers:', retobj.message);
      }
    } catch (error) {
      console.error('Error fetching dealers:', error);
    }
  }
  useEffect(() => {
    console.log('Dealers component mounted, fetching dealers...');
    get_dealers();
  },[]);  


let isLoggedIn = sessionStorage.getItem("username") != null ? true : false;

console.log('Rendering Dealers component with states:', states);
console.log('Rendering Dealers component with dealersList:', dealersList);

return(
  <div>
      <Header/>

     <table className='table'>
      <thead>
        <tr>
          <th>ID</th>
          <th>Dealer Name</th>
          <th>City</th>
          <th>Address</th>
          <th>Zip</th>
          <th>
          <select 
            name="state" 
            id="state" 
            onChange={(e) => {
              console.log('Dropdown changed! Value:', e.target.value);
              filterDealers(e.target.value);
            }}
            onClick={(e) => console.log('Dropdown clicked!')}
          >
          <option value="" disabled>State</option>
          <option value="All">All States</option>
          {states.map((state, index) => (
              <option key={index} value={state}>{state}</option>
          ))}
          </select>        

          </th>
          {isLoggedIn ? (
              <th>Review Dealer</th>
             ):<></>
          }
        </tr>
      </thead>
      <tbody>
     {dealersList.map((dealer, index) => (
        <tr key={index}>
          <td>{dealer['id']}</td>
          <td><a href={'/dealer/'+dealer['id']}>{dealer['full_name']}</a></td>
          <td>{dealer['city']}</td>
          <td>{dealer['address']}</td>
          <td>{dealer['zip']}</td>
          <td>{dealer['state']}</td>
          {isLoggedIn ? (
            <td><a href={`/postreview/${dealer['id']}`}><img src={review_icon} className="review_icon" alt="Post Review"/></a></td>
           ):<></>
          }
        </tr>
      ))}
      </tbody>
     </table>;
  </div>
)
}

export default Dealers

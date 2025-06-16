export async function loader({ request }) {
  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/javascript",
  };

  // Get the app URL from the request
  const url = new URL(request.url);
  const appUrl = `${url.protocol}//${url.host}`;

  // Create the embedded script
  const script = `
    (function() {
      // Get the current shop domain
      const shopDomain = Shopify.shop || window.location.hostname;
      
      // Function to fetch active campaign data
      async function fetchActiveCampaign() {
        try {
          const response = await fetch("${appUrl}/api/direct-campaign-data?shop=" + shopDomain);
          
          if (!response.ok) {
            throw new Error('Failed to fetch campaign data');
          }
          
          const campaignData = await response.json();
          return campaignData;
        } catch (error) {
          console.error('Error fetching campaign data:', error);
          return null;
        }
      }
      
      // Function to create and append the button
      function createButton(data) {
        if (!data || data.showFloatingButton === false) return;
        
        // Create button container
        const button = document.createElement('div');
        button.id = 'spin-wheel-button';
        button.className = 'spin-wheel-position-' + data.floatingButtonPosition;
        
        // Create button inner
        const buttonInner = document.createElement('div');
        buttonInner.className = 'spin-wheel-button-inner';
        if (data.primaryColor) {
          buttonInner.style.backgroundColor = data.primaryColor;
        }
        
        // Create icon
        const icon = document.createElement('div');
        icon.className = 'spin-wheel-icon';
        icon.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 12V20H4V12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 7H2V12H22V7Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 20V7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        
        // Create text if needed
        if (data.floatingButtonHasText) {
          const text = document.createElement('span');
          text.className = 'spin-wheel-text';
          text.textContent = data.floatingButtonText || 'SPIN & WIN';
          buttonInner.appendChild(icon);
          buttonInner.appendChild(text);
        } else {
          buttonInner.appendChild(icon);
        }
        
        // Add click event
        button.addEventListener('click', function() {
          console.log('Spin wheel button clicked');
          // Add campaign trigger logic here
        });
        
        // Append to DOM
        button.appendChild(buttonInner);
        document.body.appendChild(button);
        
        // Add styles
        addStyles();
      }
      
      // Function to add styles
      function addStyles() {
        const styles = document.createElement('style');
        styles.textContent = \`
          /* Spin Wheel Button Styles */
          #spin-wheel-button {
            position: fixed;
            z-index: 9999;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          /* Position Variants */
          .spin-wheel-position-bottomRight {
            bottom: 20px;
            right: 20px;
          }
          
          .spin-wheel-position-bottomLeft {
            bottom: 20px;
            left: 20px;
          }
          
          .spin-wheel-position-topRight {
            top: 20px;
            right: 20px;
          }
          
          .spin-wheel-position-topLeft {
            top: 20px;
            left: 20px;
          }
          
          .spin-wheel-position-centerRight {
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
          }
          
          .spin-wheel-position-centerLeft {
            top: 50%;
            left: 20px;
            transform: translateY(-50%);
          }
          
          /* Button Inner Container */
          .spin-wheel-button-inner {
            display: flex;
            align-items: center;
            background-color: #fe5300;
            color: white;
            padding: 10px 16px;
            border-radius: 50px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: transform 0.2s ease;
          }
          
          .spin-wheel-button-inner:hover {
            transform: scale(1.05);
          }
          
          /* Icon */
          .spin-wheel-icon {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          /* Text */
          .spin-wheel-text {
            margin-left: 8px;
            font-weight: 600;
            font-size: 14px;
            white-space: nowrap;
          }
          
          /* Responsive styles */
          @media (max-width: 768px) {
            #spin-wheel-button {
              transform: scale(0.9);
            }
            
            .spin-wheel-position-bottomRight,
            .spin-wheel-position-bottomLeft {
              bottom: 15px;
            }
            
            .spin-wheel-position-topRight,
            .spin-wheel-position-topLeft {
              top: 15px;
            }
          }
          
          @media (max-width: 480px) {
            #spin-wheel-button {
              transform: scale(0.8);
            }
            
            .spin-wheel-text {
              font-size: 12px;
            }
          }
        \`;
        document.head.appendChild(styles);
      }
      
      // Initialize
      document.addEventListener('DOMContentLoaded', function() {
        fetchActiveCampaign().then(createButton);
      });
    })();
  `;

  return new Response(script, { headers });
}

document.addEventListener("DOMContentLoaded", () => {
  const urlInput = document.getElementById("url");
  const methodSelect = document.getElementById("method");
  const bodyTextarea = document.getElementById("body");
  const apiForm = document.getElementById("apiForm");
  const responseOutput = document.getElementById("responseOutput");
  const responseFormat = document.getElementById("responseFormat");
  const closeBtn = document.getElementById("closeExtension");
  const responseFormatViews = document.getElementById("responseFormatViews");


  responseOutput.style.display = "none";
  bodyTextarea.style.display = "none";

  // Enable/Disable request body based on method
  methodSelect.addEventListener("change", () => {
    if (methodSelect.value === "GET" || methodSelect.value === "DELETE") {
      return   bodyTextarea.style.display = "none";     
    } else {
      bodyTextarea.style.display = "block";

    }
  });

  
// Function to apply colors to the JSON keys and values
function formatJsonWithColors(json) {
  const jsonString = JSON.stringify(json, null, 2);
  return jsonString.replace(/"(.*?)":/g, (match, p1) => {
    const colorClass = {
      id: "red",
      name: "white",
      email: "yellow",
    }[p1] || "default";
    return `<span class="${colorClass}">"${p1}"</span>:`;
  });
}





function formatProductData(data) {
  // Check if data is related to a product
  const isProduct = (item) =>
    item &&
    (item.id || item.price || item.title || item.category || item.image);

  // Function to handle rendering of arrays inside objects
  const renderArrayData = (array) => {
    if (Array.isArray(array) && array.length) {
      return array
        .map((item) => `
          <div class="product">
            <div class="product-image">
              ${item.image || item.url ? `
                <img src="${item.image || item.url}" alt="${item.title || 'Product Image'}" />
              ` : ''}
            </div>
            <div class="product-details">
              ${item.albumId ? `<p class="product-albumId"><strong>Album ID:</strong> ${item.albumId}</p>` : ''}
              ${item.id ? `<p class="product-id"><strong>Product ID:</strong> ${item.id}</p>` : ''}
              ${item.title ? `<h3 class="product-title">${item.title}</h3>` : ''}
              ${item.price ? `<p class="product-price"><strong>Price:</strong> $${item.price}</p>` : ''}
              ${item.rating ? `<p class="product-rating"><strong>Rating:</strong> ${item.rating}</p>` : ''}
              ${item.category ? `<p class="product-category"><strong>Category:</strong> ${item.category}</p>` : ''}
              ${item.description ? `<p class="product-description"><strong>Description:</strong> ${item.description}</p>` : ''}
            </div>
          </div>
        `)
        .join('');
    } else {
      return `<div class="error-message">No valid items found in array.</div>`;
    }
  };

  // Determine the type of input data
  switch (true) {
    case Array.isArray(data): {
      // Filter only valid products in the array
      const validProducts = data.filter(isProduct);

      if (!validProducts.length) {
        return `<div class="error-message">No valid products found in the array.</div>`;
      }

      const totalProducts = validProducts.length;
      const productsHtml = validProducts
        .map(
          (product) => `
        <div class="product">
          <div class="product-image">
            ${product.image || product.url ? `
              <img src="${product.image || product.url}" alt="${product.title || 'Product Image'}" />
            ` : ''}
          </div>
          <div class="product-details">
            ${product.albumId ? `<p class="product-albumId"><strong>Album ID:</strong> ${product.albumId}</p>` : ''}
            ${product.id ? `<p class="product-id"><strong>Product ID:</strong> ${product.id}</p>` : ''}
            ${product.userId ? `<p class="product-id"><strong>userId ID:</strong> ${product.userId}</p>` : ''}
            ${product.title ? `<h3 class="product-title">${product.title}</h3>` : ''}
            ${product.name ? `<h3 class="product-title">${product.name}</h3>` : ''}
            ${product.price ? `<p class="product-price"><strong>Price:</strong> $${product.price}</p>` : ''}
            ${product.rating ? `<p class="product-rating"><strong>Rating:</strong> ${product.rating}</p>` : ''}
            ${product.category ? `<p class="product-category"><strong>Category:</strong> ${product.category}</p>` : ''}
            ${product.description ? `<p class="product-description"><strong>Description:</strong> ${product.description}</p>` : ''}
          </div>
        </div>
      `)
        .join("");

      return `
        <h5 class="total-products">Total Products: ${totalProducts}</h5>
        <div class="products-container">
          ${productsHtml}
        </div>
      `;
    }

    case typeof data === "object" && isProduct(data): {
      // Single product object
      return `
        <div class="product single-product">
          <div class="product-image">
            ${data.image || data.url ? `
              <img src="${data.image || data.url}" alt="${data.title || 'Product Image'}" />
            ` : ''}
          </div>
          <div class="product-details">
            ${data.albumId ? `<p class="product-albumId"><strong>Album ID:</strong> ${data.albumId}</p>` : ''}
            ${data.id ? `<p class="product-id"><strong>Product ID:</strong> ${data.id}</p>` : ''}
            ${data.title ? `<h3 class="product-title">${data.title}</h3>` : ''}
            ${data.price ? `<p class="product-price"><strong>Price:</strong> $${data.price}</p>` : ''}
            ${data.rating ? `<p class="product-rating"><strong>Rating:</strong> ${data.rating}</p>` : ''}
            ${data.category ? `<p class="product-category"><strong>Category:</strong> ${data.category}</p>` : ''}
            ${data.description ? `<p class="product-description"><strong>Description:</strong> ${data.description}</p>` : ''}
          </div>
        </div>
      `;
    }

    case typeof data === "object" && Object.keys(data).some(key => Array.isArray(data[key])): {
      // Object with an array inside
      let resultHtml = '';
      for (const key in data) {
        if (Array.isArray(data[key])) {
          resultHtml += `
            <div class="product-array">
              <h4>Array Data for Key: ${key}</h4>
              ${renderArrayData(data[key])}
            </div>
          `;
        }
      }

      return resultHtml || `<div class="error-message">No arrays found inside object.</div>`;
    }

    default:
      // Handle invalid or unsupported data
      return `<div class="error-message">Invalid or unsupported product data.</div>`;
  }
}



function isUserData(data) {
  // Check if the data has key properties related to a user, like 'userId', 'username', etc.
  return data && (data.userId || data.username || data.email || data.firstName || data.lastName);
}


function formatUserData(data) {
  if (!data) {
    return `<div class="error-message">No user data available.</div>`;
  }
  if (!isUserData(data)) {
    return `<div class="error-message">Invalid user data format.</div>`;
  }

  switch (true) {
   //! Case 2: If data is already an array of users
    case Array.isArray(data):
      return data
        .map(
          (user) => `
            <div class="user">
              <div class="user-image">
              
              ${user.image ? ` <img src="${user.image || 'https://via.placeholder.com/100'}" alt="${user.firstName || ''} ${user.lastName || ''}" />`:''}
               
              </div>
              <div class="user-details">
              ${user.userId ? `<p class="user-userid"><strong>userId:</strong> ${user.userId}</p>` : ''}
                  ${user.id ? `<p class="user-id"><strong>ID:</strong> ${user.id}</p>` : ''}
      ${user.username ? `<p class="user-username"><strong>Username:</strong> ${user.username}</p>` : ''}
     ${user.firstName || user.name ? `
      <h3 class="user-name">
        ${user.firstName || user.name} ${user.lastName || ''}
      </h3>` : ''}
    ${user.email ? `<p class="user-email"><strong>Email:</strong> ${user.email}</p>` : ''}
    ${user.title ? `<p class="user-title"><strong>title:</strong> ${user.title}</p>` : ''}
    ${user.gender ? `<p class="user-gender"><strong>Gender:</strong> ${user.gender}</p>` : ''}
    ${user.phone ? `<p><strong>Phone:</strong> ${user.phone}</p>` : ''}
    ${user.password ? `<p><strong>Password:</strong> ${user.password}</p>` : ''}
    ${user.birthDate ? `<p><strong>Birth Date:</strong> ${user.birthDate}</p>` : ''}
    ${user.bloodGroup ? `<p><strong>Blood Group:</strong> ${user.bloodGroup}</p>` : ''}

                ${user.address ? `
                  <p class="user-address"><strong>Address:</strong> 
                    ${user.address.city || ''}, 
                    ${user.address.state || ''}, 
                    ${user.address.country || ''}, 
                    ${user.address.address || ''}, 
                    ${user.address.stateCode || ''}
                  </p>` 
                : ''}
                ${user.completed?`<p class="user-completed"><strong>completed:</strong> ${user.completed || 'N/A'}</p>`:''} 
               ${user.role?`<p class="user-role"><strong>Role:</strong> ${user.role || 'N/A'}</p>`:''} 
              </div>
            </div>
          `
        )
        .join(''); // Combine all user HTML into one string


        case Array.isArray(data.users): {
          const users = data.users; // Extract the users array
          return users
            .map(
              (user) => `
                <div class="user">
                  <div class="user-image">
                    ${
                      user.image
                        ? `<img src="${user.image || 'https://via.placeholder.com/100'}" alt="${user.firstName || ''} ${user.lastName || ''}" />`
                        : ''
                    }
                  </div>
                  <div class="user-details">
                    ${user.id ? `<p class="user-id"><strong>ID:</strong> ${user.id}</p>` : ''}
                    ${
                      user.username
                        ? `<p class="user-username"><strong>Username:</strong> ${user.username}</p>`
                        : ''
                    }
                    ${
                      user.firstName || user.name
                        ? `<h3 class="user-name">${user.firstName || user.name} ${
                            user.lastName || ''
                          }</h3>`
                        : ''
                    }
                    ${
                      user.email
                        ? `<p class="user-email"><strong>Email:</strong> ${user.email}</p>`
                        : ''
                    }
                    ${
                      user.gender
                        ? `<p class="user-gender"><strong>Gender:</strong> ${user.gender}</p>`
                        : ''
                    }
                    ${
                      user.phone
                        ? `<p><strong>Phone:</strong> ${user.phone}</p>`
                        : ''
                    }
                    ${
                      user.birthDate
                        ? `<p><strong>Birth Date:</strong> ${user.birthDate}</p>`
                        : ''
                    }
                    ${
                      user.bloodGroup
                        ? `<p><strong>Blood Group:</strong> ${user.bloodGroup}</p>`
                        : ''
                    }
                    ${
                      user.address
                        ? `<p class="user-address"><strong>Address:</strong> 
                          ${user.address.city || ''}, 
                          ${user.address.state || ''}, 
                          ${user.address.country || ''}, 
                          ${user.address.address || ''}, 
                          ${user.address.stateCode || ''}
                        </p>`
                        : ''
                    }
                    ${
                      user.hair
                        ? `<p class="user-hair"><strong>Hair:</strong> ${
                            user.hair.color || 'N/A'
                          } - ${user.hair.type || 'N/A'}</p>`
                        : ''
                    }
                  </div>
                </div>
              `
            )
            .join('');
        }

    // Handle single object
    case typeof data === 'object':
      return `
        <div class="user">
          <div class="user-image">
            <img src="${data.image || 'https://via.placeholder.com/100'}" alt="${data.firstName || ''} ${data.lastName || ''}" />
          </div>
          <div class="user-details">
            <p class="user-id"><strong>ID:</strong> ${data.id}</p>
            <p class="user-username"><strong>Username:</strong> ${data.username || 'N/A'}</p>
            <h3 class="user-name">${data.firstName || 'N/A'} ${data.lastName || ''}</h3>
            <p class="user-email"><strong>Email:</strong> ${data.email || 'N/A'}</p>
            <p class="user-gender"><strong>Gender:</strong> ${data.gender || 'N/A'}</p>
            <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
            <p><strong>Password:</strong> ${data.password || 'N/A'}</p>
            <p><strong>Birth Date:</strong> ${data.birthDate || 'N/A'}</p>
            <p><strong>Blood Group:</strong> ${data.bloodGroup || 'N/A'}</p>
            <p class="user-address"><strong>Address:</strong> ${
              data.address.city || ''
            }, ${data.address.state || ''}, ${data.address.country || ''}, ${
        data.address.address || ''
      }, ${data.address.stateCode || ''}, ${data.address.city || ''}</p>
            <p class="user-role"><strong>Role:</strong> ${data.role || 'N/A'}</p>
          </div>
        </div>
      `;

    // Handle invalid data type
    default:
      return `<div class="error-message">Invalid data format.</div>`;
  }
}

   
  






  // Handle form submission
  apiForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const url = urlInput.value;
    const method = methodSelect.value;
    let body = null;

    try {
      if (bodyTextarea.value) {
        body = JSON.parse(bodyTextarea.value);
      }

      const options = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: method === "POST" || method === "PUT" ? JSON.stringify(body) : null,
      };

      const response = await fetch(url, options);
      let data;

      switch (responseFormat.value) {
        case "text":
          data = await response.text();
          break;
        case "raw":
          data = response.body;
          break;
        default:
          data = await response.json();
      }

     
      
      console.log(data[0]);


     
      responseFormatViews.addEventListener("change", () => {
        switch (responseFormatViews.value) {
          case "product":
            responseFormat.disabled = true;
            let formattedProductData = formatProductData(data); // Assuming 'data' is already available
            responseOutput.innerHTML = formattedProductData;
            break;

            case "user":
              // responseFormat.disabled = true;
              responseFormat.disabled = true;
              const formattedUserData = formatUserData(data); // यूज़र डेटा फॉर्मेट करें
              responseOutput.innerHTML = formattedUserData; // इसे आउटपुट में दिखाएं
              break;
      
          default: // For other cases like 'user' or 'data'
            responseFormat.disabled = false;
            const formattedResponse = formatJsonWithColors(data);
            responseOutput.innerHTML = formattedResponse;
            break;
        }
      });
      
       
      
    if (responseFormatViews.value === "product") {
      responseFormat.disabled = true;
      const formattedProductData = formatProductData(data);
      responseOutput.innerHTML = formattedProductData;
    } else if (responseFormatViews.value === "user") {
      responseFormat.disabled = true;
      const formattedUserData = formatUserData(data); 
      responseOutput.innerHTML = formattedUserData; 
    } else {
      responseFormat.disabled = false;
      const formattedResponse = formatJsonWithColors(data);
      responseOutput.innerHTML = formattedResponse;
    }




      if(responseFormat){
        responseOutput.style.display = "block";
      }
     
    } catch (err) {
      responseOutput.textContent = `Error: ${err.message}`;
    }
  });

  // Close the extension
  closeBtn.addEventListener("click", () => {
    window.close();
  });
});

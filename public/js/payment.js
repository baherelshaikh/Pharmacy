let VAT ;
const Delivery = 4.95;
const Token = localStorage.getItem("Token")
const CartItems = JSON.parse(localStorage.getItem('CartItems')) || [];
    document.addEventListener("DOMContentLoaded", () => {
        const orderSummary = document.getElementById("order-summary");
        const TotalE = document.querySelector(".Total")
        let Total = 0    
    
        CartItems.forEach((product) => {
            const table = document.createElement("table");
            table.className = "order-table";
            const Price = Number(product.price.toFixed(2))*product.quantity
            Total += Price
            table.innerHTML = `
                <tbody>
                    <tr>
                        <td>
                            <img src="${product.image}" class='full-width' alt='Product Image'>
                        </td>
                        <td>
                            <span class='thin'>${product.name}</span><br>
                            <span class='thin'>Price: $${product.price}</span><br>
                            <span class='thin small'>Quantity: ${product.quantity}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class='price'>$${Price}</div>
                        </td>
                    </tr>
                </tbody>
            `;
            
            orderSummary.appendChild(table); // Add the table to the order summary
            const line = document.createElement("div");
            line.className = "line"; // Horizontal separator
            orderSummary.appendChild(line); // Add the separator after the last table
        });
        Total = Number(Total.toFixed(2))
        console.log(Total)
        VAT = (Total * (19/100))
        VAT = Number(VAT.toFixed(2))
        let finalTotal = Total + parseFloat(VAT) + Delivery;
        finalTotal = Number(finalTotal.toFixed(2));
        const totalE = document.createElement("div")
        totalE.className = "totalE"
        totalE.innerHTML = `<span class= "totalSpan">
          <div style="text-align: left; font-wight:400; line-height: 1.2em; font-size:16px; font-size:1rm" >VAT 19%</div>
          <div style="text-align: left; font-wight:400; line-height: 1.2em; font-size:16px; font-size:1rm">Delivery</div>
          TOTAL
        </span>
        <span class = "totalSpan" >
          <div style="text-align: right; font-wight:400; line-height: 1.2em; font-size:16px; font-size:1rm">$${VAT}</div>
          <div style="text-align: right; font-wight:400; line-height: 1.2em; font-size:16px; font-size:1rm">$${Delivery}</div>
          $${finalTotal}
        </span>`
        orderSummary.appendChild(totalE)
    });
var cardDrop = document.getElementById('card-dropdown');
var activeDropdown;
cardDrop.addEventListener('click',function(){
var node;
for (var i = 0; i < this.childNodes.length-1; i++)
node = this.childNodes[i];
if (node.className === 'dropdown-select') {
  node.classList.add('visible');
   activeDropdown = node; 
};
})

window.onclick = function(e) {
console.log(e.target.tagName)
console.log('dropdown');
console.log(activeDropdown)
if (e.target.tagName === 'LI' && activeDropdown){
if (e.target.innerHTML === 'Master Card') {
  document.getElementById('credit-card-image').src = './uploads/master-Card-Logo.png';
      activeDropdown.classList.remove('visible');
  activeDropdown = null;
  e.target.innerHTML = document.getElementById('current-card').innerHTML;
  document.getElementById('current-card').innerHTML = 'Master Card';
}
else if (e.target.innerHTML === 'PayPal') {
     document.getElementById('credit-card-image').src = './uploads/PayPal-Logo.png';
      activeDropdown.classList.remove('visible');
  activeDropdown = null;
  e.target.innerHTML = document.getElementById('current-card').innerHTML;
  document.getElementById('current-card').innerHTML = 'PayPal';      
}
else if (e.target.innerHTML === 'Visa') {
     document.getElementById('credit-card-image').src = './uploads/visa_logo (1).png';
      activeDropdown.classList.remove('visible');
  activeDropdown = null;
  e.target.innerHTML = document.getElementById('current-card').innerHTML;
  document.getElementById('current-card').innerHTML = 'Visa';
}
}
else if (e.target.className !== 'dropdown-btn' && activeDropdown) {
activeDropdown.classList.remove('visible');
activeDropdown = null;
}
}
const Pay = document.querySelector(".pay-btn")
Pay.addEventListener("click",()=>{
const cardN = document.querySelector(".card-number").value
const cardH = document.querySelector(".card-holder").value
const expires = document.querySelector(".expires").value
const cvc = document.querySelector(".cvc").value
if(cardH && cardN && expires && cvc){
let items = []
for(const product of CartItems){
  items.push({product:product.id, amount:product.quantity})
}
const PaymentData = {items,tax:VAT, shippingFee:Delivery}
  console.log(PaymentData)

async function Payment (){

  try {
      const response = await fetch("http://localhost:5000/api/v1/order", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${Token}`,
          },
          body: JSON.stringify(PaymentData),
      });

      if (response.ok) {
          alert("Purchase successful!"); // Notify the user of success
          localStorage.removeItem('CartItems');
          window.location.href = `profile.html`;
      } else {
          console.error("Purchase failed:", response.statusText); // Log the error
          alert("Purchase failed."); // Notify the user
          cardN.value = cardN || " "
          cardH.value = cardH || " "
          expires.value = expires || " " 
          cvc.value = cvc || " "
      }
  } catch (error) {
      console.error("Error during purchase:", error);
      alert("An error occurred. Please try again."); // Notify the user of error
      cardN.value = cardN || " "
      cardH.value = cardH || " "
      expires.value = expires || " " 
      cvc.value = cvc || " "
    }
}
Payment();
}else{
alert("please fill out all the fields")
cardN.value = cardN || " "
cardH.value = cardH || " "
expires.value = expires || " " 
cvc.value = cvc || " "
}
})

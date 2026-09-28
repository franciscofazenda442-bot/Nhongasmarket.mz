const defaultProducts=[
{id:1,name:"Samsung Galaxy",price:18500,condition:"Usado",category:"Eletrónicos",seller:"João M.",icon:"📱",image:""},
{id:2,name:"T-shirt Streetwear",price:950,condition:"Novo",category:"Moda",seller:"Fashion Moz",icon:"👕",image:""},
{id:3,name:"AirPods",price:2200,condition:"Usado",category:"Acessórios",seller:"Carlos",icon:"🎧",image:""},
{id:4,name:"Sofá 3 lugares",price:12500,condition:"Usado",category:"Casa",seller:"Ana C.",icon:"🛋️",image:""},
{id:5,name:"Relógio moderno",price:1800,condition:"Novo",category:"Acessórios",seller:"Style Shop",icon:"⌚",image:""},
{id:6,name:"Laptop HP",price:28000,condition:"Usado",category:"Eletrónicos",seller:"Tech Moz",icon:"💻",image:""},
{id:7,name:"Tênis",price:2500,condition:"Novo",category:"Moda",seller:"Urban Store",icon:"👟",image:""},
{id:8,name:"Mesa de estudo",price:4500,condition:"Usado",category:"Casa",seller:"Marta",icon:"🪑",image:""}
];
let products=JSON.parse(localStorage.getItem("nhonguista_products"))||defaultProducts;
let cart=JSON.parse(localStorage.getItem("nhonguista_cart"))||[];
products=products.map(p=>({stock:5,whatsapp:"",contact:"",brand:"",model:"",color:"",size:"",material:"",weight:"",validity:"",location:"",delivery:"",description:"",...p}));
let currentCategory="Todos";
const money=n=>new Intl.NumberFormat("pt-MZ",{style:"currency",currency:"MZN",maximumFractionDigits:0}).format(n);

document.getElementById("menuBtn").onclick=()=>document.getElementById("nav").classList.toggle("open");
function setCategory(c){currentCategory=c;document.getElementById("categoryLabel").textContent=c;renderProducts();location.hash="produtos"}
function renderProducts(){
 const q=(document.getElementById("searchInput")?.value||"").toLowerCase();
 const cond=document.getElementById("conditionFilter")?.value||"";
 const list=products.filter(p=>(currentCategory==="Todos"||p.category===currentCategory)&&(!cond||p.condition===cond)&&(`${p.name} ${p.seller} ${p.category}`.toLowerCase().includes(q)));
 const grid=document.getElementById("productGrid");
 grid.innerHTML=list.length?list.map(p=>`<article class="product">
 <div class="product-img">${p.image?`<img src="${p.image}" alt="${p.name}">`:p.icon}</div>
 <div class="product-body"><span class="condition">${p.condition}</span><h3>${p.name}</h3><div class="price">${money(p.price)}</div><div class="seller">Vendido por ${p.seller}</div>
 <div class="stock ${p.stock===0?'out':p.stock<=3?'low':''}">${p.stock===0?'❌ Sem stock':`📦 Stock: ${p.stock}`}</div>
 <div class="product-actions">
 <button onclick="addCart(${p.id})" ${p.stock===0?'disabled':''}>🛒 Comprar</button>
 <button onclick="openChat(${p.id})">💬 Chat</button>
 <button class="wa" onclick="openWhatsApp(${p.id})">WhatsApp</button>
 <button onclick="showDetails(${p.id})">Ver detalhes</button>
 </div></div></article>`).join(""):`<div class="empty">Nenhum produto encontrado.</div>`;
 updateCart();
}
function addCart(id){
 const p=products.find(x=>x.id===id);
 if(!p || p.stock<=0){alert("Este produto está sem stock.");return}
 const item=cart.find(x=>x.id===id);
 if(item && item.qty>=p.stock){alert("Não há mais unidades disponíveis.");return}
 item?item.qty++:cart.push({...p,qty:1});
 p.stock--;
 localStorage.setItem("nhonguista_products",JSON.stringify(products));
 saveCart(); renderProducts(); alert("Produto adicionado ao carrinho!");
}
function saveCart(){localStorage.setItem("nhonguista_cart",JSON.stringify(cart));updateCart()}
function updateCart(){document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0)}
function openCart(){
 const content=cart.length?`<h2>🛒 Carrinho</h2>${cart.map(x=>`<div class="cart-item"><span>${x.name} × ${x.qty}</span><b>${money(x.price*x.qty)}</b></div>`).join("")}<div class="total">Total: ${money(cart.reduce((s,x)=>s+x.price*x.qty,0))}</div><button class="btn primary" style="width:100%" onclick="checkout()">Finalizar compra</button>`:`<h2>🛒 Carrinho vazio</h2><p style="margin-top:10px;color:#777">Adicione produtos para começar.</p>`;
 openModal(content);
}
function checkout(){alert("Checkout demonstrativo. Na próxima versão podemos ligar M-Pesa/e-Mola e processamento real.");}
function openSell(){
 openModal(`<h2>📦 Publicar produto</h2><p style="color:#777">Preencha os dados do seu anúncio.</p>
 <form class="form" onsubmit="publishProduct(event)">
 <input id="pname" required placeholder="Nome do produto">
 <input id="pprice" required type="number" min="0" placeholder="Preço em MZN">
 <input id="pstock" required type="number" min="0" placeholder="Stock / quantidade disponível">
 <select id="pcondition"><option>Novo</option><option>Usado</option></select>
 <select id="pcategory"><option>Eletrónicos</option><option>Moda</option><option>Casa</option><option>Acessórios</option><option>Outros</option></select>
 <input id="pbrand" placeholder="Marca">
 <input id="pmodel" placeholder="Modelo">
 <input id="pcolor" placeholder="Cor">
 <input id="psize" placeholder="Tamanho / dimensão">
 <input id="pmaterial" placeholder="Material">
 <input id="pweight" placeholder="Peso">
 <input id="pvalidity" type="date" title="Data de validade (se aplicável)">
 <input id="plocation" required placeholder="Localização do produto">
 <input id="pcontact" required placeholder="Contacto do vendedor">
 <input id="pwhatsapp" placeholder="WhatsApp (ex.: 25884xxxxxxx)">
 <input id="pdelivery" placeholder="Opções/custo de entrega">
 <input id="pseller" required placeholder="Nome da loja/vendedor">
 <input id="pimage" type="file" accept="image/*">
 <textarea id="pdesc" placeholder="Descrição detalhada"></textarea>
 <button class="btn primary">Publicar produto</button></form>`);
}
function publishProduct(e){
 e.preventDefault();
 const file=document.getElementById("pimage").files[0];
 const save=image=>{
 products.unshift({
 id:Date.now(),name:pname.value,price:Number(pprice.value),stock:Number(pstock.value),condition:pcondition.value,
 category:pcategory.value,brand:pbrand.value,model:pmodel.value,color:pcolor.value,size:psize.value,
 material:pmaterial.value,weight:pweight.value,validity:pvalidity.value,location:plocation.value,
 contact:pcontact.value,whatsapp:pwhatsapp.value,delivery:pdelivery.value,seller:pseller.value,
 icon:"📦",image:image||"",description:pdesc.value
 });
 localStorage.setItem("nhonguista_products",JSON.stringify(products));closeModal();renderProducts();alert("Produto publicado com sucesso!");
};
 if(file){const r=new FileReader();r.onload=()=>save(r.result);r.readAsDataURL(file)}else save("");
}
function openLogin(){
 openModal(`<h2>👤 Entrar / Cadastrar</h2><form class="form" onsubmit="login(event)"><input id="username" required placeholder="Nome ou nome da loja"><input type="email" required placeholder="Email"><input type="password" required placeholder="Palavra-passe"><button class="btn primary">Entrar</button></form>`);
}
function login(e){e.preventDefault();const n=document.getElementById("username").value;localStorage.setItem("nhonguista_user",n);document.getElementById("accountStatus").textContent=`Sessão iniciada como ${n}.`;closeModal();alert("Sessão iniciada!")}
function openWhatsApp(id){
 const p=products.find(x=>x.id===id);
 let number=(p.whatsapp||p.contact||"").replace(/\D/g,"");
 if(!number){alert("O vendedor ainda não adicionou um número de WhatsApp.");return}
 if(number.startsWith("0")) number="258"+number.slice(1);
 const text=encodeURIComponent(`Olá ${p.seller}, tenho interesse no produto "${p.name}" por ${money(p.price)}.`);
 window.open(`https://wa.me/${876514200}?text=${text}`,"_blank");
}
function openChat(id){
 const p=products.find(x=>x.id===id);
 const key="chat_"+id;
 const messages=JSON.parse(localStorage.getItem(key)||"[]");
 openModal(`<h2>💬 Chat com ${p.seller}</h2>
 <div class="seller-info"><b>${p.name}</b><br>Preço: ${money(p.price)} · Stock: ${p.stock}</div>
 <div class="chat" id="chatBox">${messages.length?messages.map(m=>`<div class="msg ${m.me?'me':''}">${escapeHtml(m.text)}</div>`).join(""):`<p style="color:#777">Inicie uma conversa sobre este produto.</p>`}</div>
 <div class="chat-input"><input id="chatMsg" placeholder="Escreva uma mensagem..." onkeydown="if(event.key==='Enter')sendChat(${id})"><button class="btn primary" onclick="sendChat(${id})">Enviar</button></div>`);
}
function sendChat(id){
 const input=document.getElementById("chatMsg"); if(!input.value.trim())return;
 const key="chat_"+id; const messages=JSON.parse(localStorage.getItem(key)||"[]");
 messages.push({text:input.value.trim(),me:true,date:new Date().toISOString()});
 localStorage.setItem(key,JSON.stringify(messages)); openChat(id);
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function showDetails(id){
 const p=products.find(x=>x.id===id);
 openModal(`<h2>${p.name}</h2><div class="seller-info"><b>${p.seller}</b><br>📍 ${p.location||"Localização não informada"}<br>📞 ${p.contact||"Contacto não informado"}</div>
 <p>${p.description||"Sem descrição."}</p><div class="form">
 <div><b>Preço:</b> ${money(p.price)}</div><div><b>Stock:</b> ${p.stock}</div><div><b>Condição:</b> ${p.condition}</div>
 <div><b>Categoria:</b> ${p.category}</div><div><b>Marca:</b> ${p.brand||"-"}</div><div><b>Modelo:</b> ${p.model||"-"}</div>
 <div><b>Cor:</b> ${p.color||"-"}</div><div><b>Tamanho:</b> ${p.size||"-"}</div><div><b>Material:</b> ${p.material||"-"}</div>
 <div><b>Peso:</b> ${p.weight||"-"}</div><div><b>Validade:</b> ${p.validity||"-"}</div><div><b>Entrega:</b> ${p.delivery||"-"}</div>
 </div><div class="hero-actions"><button class="btn primary" onclick="openChat(${p.id})">💬 Conversar</button><button class="btn wa" onclick="openWhatsApp(${p.id})">WhatsApp</button></div>`);
}
function openModal(html){document.getElementById("modalContent").innerHTML=html;document.getElementById("modal").classList.remove("hidden")}
function closeModal(){document.getElementById("modal").classList.add("hidden")}
window.onclick=e=>{if(e.target.id==="modal")closeModal()}
renderProducts();
const user=localStorage.getItem("nhonguista_user");if(user)document.getElementById("accountStatus").textContent=`Sessão iniciada como ${user}.`;

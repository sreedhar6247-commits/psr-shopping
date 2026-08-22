export type Product = {
  id: number; name: string; category: string; description: string; price: number; image: string;
  sizes: string[]; colours: string[]; stock: number; active: boolean;
};
export const products: Product[] = [
  {id:1,name:"Elegant Cotton Kurti",category:"Kurtis",description:"Comfortable everyday kurti with an elegant finish.",price:799,image:"/products/kurti-1.jpg",sizes:["S","M","L","XL","XXL"],colours:["Blue","Black","Pink"],stock:20,active:true},
  {id:2,name:"Designer Anarkali Kurti",category:"Kurtis",description:"Graceful Anarkali style for festive and special occasions.",price:1199,image:"/products/kurti-2.jpg",sizes:["S","M","L","XL"],colours:["Pink","Red","Green"],stock:20,active:true},
  {id:3,name:"Beautiful Party Saree",category:"Sarees",description:"A beautiful saree for celebrations, parties and family events.",price:999,image:"/products/kurti-3.jpg",sizes:["Free Size"],colours:["Red","Blue","Green"],stock:20,active:true},
  {id:4,name:"Premium Silk Saree",category:"Sarees",description:"Classic festive style with a premium traditional look.",price:1499,image:"/products/kurti-4.jpg",sizes:["Free Size"],colours:["Purple","Green","Pink"],stock:20,active:true},
  {id:5,name:"Bridal Lehenga",category:"Lehengas",description:"Statement bridal-inspired outfit for celebrations.",price:2499,image:"/products/kurti-1.jpg",sizes:["S","M","L","XL"],colours:["Maroon","Pink","Red"],stock:12,active:true},
  {id:6,name:"Designer Lehenga",category:"Lehengas",description:"Festive designer look with a comfortable fit.",price:1999,image:"/products/kurti-2.jpg",sizes:["S","M","L","XL"],colours:["Pink","Blue","Wine"],stock:12,active:true},
  {id:7,name:"Comfort Night Suit",category:"Night Wear",description:"Soft and comfortable night wear for relaxed evenings.",price:699,image:"/products/kurti-3.jpg",sizes:["M","L","XL","XXL"],colours:["Pink","Blue","Purple"],stock:20,active:true},
  {id:8,name:"Soft Cotton Night Wear",category:"Night Wear",description:"Lightweight cotton night wear made for everyday comfort.",price:749,image:"/products/kurti-4.jpg",sizes:["M","L","XL","XXL"],colours:["Blue","Grey","Pink"],stock:20,active:true},
];
export function getProduct(id:number){return products.find(p=>p.id===id&&p.active);}

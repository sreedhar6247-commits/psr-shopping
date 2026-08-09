export async function GET() {
  const products = [
    {
      id: 1,
      name: "Beautiful Kurti 1",
      category: "Kurtis",
      description: "Elegant women's kurti for everyday and festive wear.",
      price: 699,
      imageUrl: "/products/kurti-1.jpg",
      stock: 20,
      active: true,
    },
    {
      id: 2,
      name: "Beautiful Kurti 2",
      category: "Kurtis",
      description: "Stylish women's kurti with a comfortable fit.",
      price: 799,
      imageUrl: "/products/kurti-2.jpg",
      stock: 20,
      active: true,
    },
    {
      id: 3,
      name: "Beautiful Kurti 3",
      category: "Kurtis",
      description: "Trendy women's kurti suitable for casual and special occasions.",
      price: 899,
      imageUrl: "/products/kurti-3.jpg",
      stock: 20,
      active: true,
    },
    {
      id: 4,
      name: "Beautiful Kurti 4",
      category: "Kurtis",
      description: "Elegant and comfortable kurti for women.",
      price: 999,
      imageUrl: "/products/kurti-4.jpg",
      stock: 20,
      active: true,
    },
  ];

  return Response.json(products);
}

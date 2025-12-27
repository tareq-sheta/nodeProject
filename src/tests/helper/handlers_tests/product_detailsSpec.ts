
import { Order, Order_Type } from "../../../models/orders";
import { User } from "../../../models/users";
import { User_type } from "../../../models/users";

const storeOrdr = new Order();
const storeUsr = new User();
// const storeUsr = new UserStore();
const orderRef: Order_Type = {id:3, quantity_in_order: 1,user_id: 1,status_of_order: 'complete'};
let orderTest: Order_Type;

describe("Testing product Model", () => {
	beforeAll(async () => {
		const user = await storeUsr.createRow({ first_name: "tareq1", last_name: "ahmad1", user_password: "test" });
		if (user.id) {    
      orderRef.user_id = Number(user.id);
    }
	});
	it("is there is a create method?", () => {
		expect(storeOrdr.createRow).toBeDefined();
	});

	it("if create can add new order", async () => {
		orderTest = await storeOrdr.createRow(orderRef);
		// order.items = [null];
		expect({ id:3,quantity_in_order: 1,user_id: 2,status_of_order: 'complete'}).toEqual({
			id:3,
			quantity_in_order: orderTest.quantity_in_order,
			user_id: orderTest.user_id,
			status_of_order: orderTest.status_of_order,
		});
	});

	it("is there is a index method?", () => {
		expect(storeOrdr.indexAllContent).toBeDefined();
	});

	it("if index can call all orders", async () => {
		const allOrders = await storeOrdr.indexAllContent();
		expect(allOrders).toContain(orderTest);
	});

	it("is there is a show method?", () => {
		expect(storeOrdr.showOneRow).toBeDefined();
	});

	it("if show can call one order", async () => {
		const foundOrder = await storeOrdr.showOneRow(orderTest.id as number);
		expect(foundOrder).toEqual({
       id: 2, 
       quantity_in_order: 1,
       user_id:2,
       status_of_order:"complete", 
      });
	});

	it("is there is a update method?", () => {
		expect(storeOrdr.update).toBeDefined();
	}); 

	 it("if update can update an order", async () => {
		const updtedOrdr = await storeOrdr.update({ ...orderTest, status_of_order: "completed" });
		expect(updtedOrdr.status_of_order).toEqual("completed");
	}); 

	 it("is there is a delete method?", () => {
		expect(storeOrdr.delete).toBeDefined();
	});

	/* it("if delete can delete order", async () => {
		const deltdOrdr = await storeOrdr.delete(orderTest.id as number);
		expect(deltdOrdr.id as number).toBeFalsy;
	}); */
}); 

// import { Product,/*  ProductStore, */ Product_Type } from "../../../models/products";

// const productStore = new Product();
// const productBase: Product_Type = { id:1, prdct_name: "ps4", price: 4, category: "console" };
// let product: Product_Type;

// describe("Testing Model: product", () => {
// 	it("is there is a create method?", () => {
// 		expect(productStore.createRow).toBeDefined();
// 	});

// 	it("if create can add new order", async () => {
// 		product = await productStore.createRow(productBase);
// 		expect({id:1 as number/* product.id */, name: 'ps4'/* product.prdct_name */, price:/*  product.price */4, category: 'console'/* product.category */ }).toEqual({
//       id:productBase.id as number,
// 			name: productBase.prdct_name,
// 			price: productBase.price,
// 			category: productBase.category as string
// 		});
// 	});

// 	it("is there is a index method?", () => {
// 		expect(productStore.index).toBeDefined();
// 	});

// 	it("if index can call all orders", async () => {
// 		const products = await productStore.index();
// 		expect(products).toContain(product);
// 	});

// 	it("is there is a show method?", () => {
// 		expect(productStore.showOneRow).toBeDefined();
// 	});

// 	it("if show can call one order", async () => {
//     const foundOrder = await productStore.showOneRow(productBase.id as number);
// 		expect(foundOrder).toEqual({
//        id:1,
//       prdct_name: "ps4",
//       price: 4,
//       category: "console" 
//       });
// 		/* const foundProducts = await productStore.showOneRow(product.id as number);
// 		expect(foundProducts).toEqual({
//       id:1,
//       name:"ps4",
//       price:4,
//       category:"console"
//     });
// 	}); */

//   it("is there is a update method?", () => {
//     expect(productStore.update).toBeDefined();
//   });
  
//   it("if update can update an order", async () => {
//     const updatedProduct = await productStore.update({ ...product, prdct_name: "test product" });
//     expect({ ...product, prdct_name: "test product" }).toEqual(updatedProduct);
//   });
  
//   it("is there is a delete method?", () => {
//     expect(productStore.delete).toBeDefined();
//   });
  
//   it("if delete can delete order", async () => {
//     const deletedProduct = await productStore.delete(product.id as number);
//     expect(deletedProduct.id).toEqual(product.id);
//   });
  
//   })
// });
// import { Product, Product_Type } from "../../../models/products";
// /* import { User } from "../../../models/users";
// import { User_type } from "../../../models/users"; */

// const storePrdct = new Product();
// /* const storeUsr = new User(); */
// // const storeUsr = new UserStore();
// const prodctRef:Product_Type  = {id:1 , prdct_name: "a71",price: 9000,category:"mobile"};
// let prodctTest: Product_Type;

// describe("Testing product Model", () => {
  
//   it("    √ is there is a create method?", () => {
//     expect(storePrdct.createRow).toBeDefined();
//     it("Testing the create model with an order", async () => {
//       prodctTest = await storePrdct.createRow(prodctRef);
//       expect({id:1 , prdct_name: "a71",price: 9000,category:"mobile"}).toEqual({
//         id: prodctTest.id as number, 
//          prdct_name: prodctTest.prdct_name ,
//          price: prodctTest.price,
//          category: prodctTest.category as string, 
//       });
//     });
//   it(  " is there is a index method?", () => {
//       expect(storePrdct.index).toBeDefined();
//     });
// 	});
//   it("Testing the index model to include the order", async () => {
//     const allProducts = await storePrdct.index();
//     expect(allProducts).toContain(prodctTest);
//   });
//   it("    √ is there is a show method?", () => {
//     expect(storePrdct.showOneRow).toBeDefined();
//   });
// 	});
//   it("Testing the show model to return the order", async () => {
//     const foundOrder = await storePrdct.showOneRow(prodctTest.id as number);
//     expect(foundOrder).toEqual({
//        id: prodctTest.id, 
//        prdct_name: prodctTest.prdct_name ,
//        price: prodctTest.price,
//        category: prodctTest.category, 
//       });
//   });

//   it("    √ is there is a update method?", () => {
//     expect(storePrdct.update).toBeDefined();
//   }); 
//   it("Testing the update model to return the updated order", async () => {
//    const updtedPrdct = await storePrdct.update({ ...prodctTest, category: "completed" });
//    expect(updtedPrdct.category).toEqual("completed");
//  }); 
  
//   it("    √ is there is a delete method?", () => {
//    expect(storePrdct.delete).toBeDefined();
//   });

//   it("if delete can delete order", async () => {
//     const deltdPrdct = await storePrdct.delete(prodctTest.id as number);
//     expect(deltdPrdct.id as number).toEqual(prodctTest.id as number);
//   });


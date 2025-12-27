
import { Order, Order_Type } from "../../../models/orders";
import { User } from "../../../models/users";
import { User_type } from "../../../models/users";

const storeOrdr = new Order();
const storeUsr = new User();
// const storeUsr = new UserStore();
const orderRef: Order_Type = {id:2, quantity_in_order: 1,user_id: 1,status_of_order: 'complete'};
let orderTest: Order_Type;

describe("Testing user Model", () => {
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
		expect({ id:2,quantity_in_order: 1,user_id: 3,status_of_order: 'complete'}).toEqual({
			id:2,
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
       id: 3, 
       quantity_in_order: 1,
       user_id:3,
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
// import { User_type, User } from "../../../models/users";

// const userStore = new User();
// const userBase: User_type = { 
//   id:1,
//   first_name: "test_user", last_name: "test_user", user_password: "test123" };
// let user: User_type;
// describe("Testing Model: user", () => {
// 	it("Must have a create method", () => {
// 		expect(userStore.createRow).toBeDefined();
// 	});

// 	it("Testing the create model with a user", async () => {
// 	user = await userStore.createRow(userBase);
// 		expect(user).toEqual({id:1, first_name: "test_user", last_name:"test_user" ,user_password:"test123"  });
// 	});

// 	it("Must have an index method", () => {
// 		expect(userStore.indexAllContent).toBeDefined();
// 	});

// 	it("Testing the index model to include the user", async () => {
// 		const users = await userStore.indexAllContent();
// 		expect(users).toContain(user);
// 	});

// 	it("Must have a show method", () => {
// 		expect(userStore.showOneRow).toBeDefined();
// 	});

// 	it("Testing the show model to return the user", async () => {
// 		const foundUser = await userStore.showOneRow(user.id as number);
// 		expect(foundUser).toEqual(user);
// 	});

// 	it("Must have an update method", () => {
// 		expect(userStore.update).toBeDefined();
// 	});

// 	it("Testing the update model to return the updated user", async () => {
// 		const updatedUser = await userStore.update({ ...user, first_name: "C3", last_name: "PO" });
// 		expect({ id: user.id, firstname: "C3", lastname: "PO", password_digest: user.user_password}).toEqual({
// 			id: updatedUser.id as number,
// 			firstname: updatedUser.first_name,
// 			lastname: updatedUser.last_name as string,
// 			password_digest: updatedUser.user_password,
// 		});
// 	});

// 	it("Must have a delete method", () => {
// 		expect(userStore.delete).toBeDefined();
// 	});

// 	it("Testing the delete model to return the deleted user", async () => {
// 		const deletedUser = await userStore.delete(user.id as number);
// 		expect(deletedUser.id).toEqual(user.id);
// 	});
// });
// //  import { User,User_type } from "../../../models/users";
// //  import { hasher} from "../../../Security/Authenticate-Autherize";
 
// //  const storeUsr = new User();
// //  // const storeUsr = new UserStore();
// //  const userRef: User_type = {id:1, first_name: "F.test",last_name: "F.test",user_password: 'mytest'};
// //  let userTest: User_type;
 
// //  describe("Testing order Model", () => {
// //    /* beforeAll(async () => {
// //      const user = await storeUsr.createRow({ first_name: "tareq", last_name: "ahmad", user_password: "test" });
// //      if (user.id) {    
// //        userRef.user_id = Number(user.id);
// //      }
// //    }); */
// //    it("is there is a create method?", () => {
// //      expect(storeUsr.createRow).toBeDefined();
// //    });
 
// //    it("if create can add new userr", async () => {
// //      userTest = await storeUsr.createRow(userRef);
// //      // order.items = [null];
// //      expect(userRef).toEqual({id:1, first_name: "F.test",last_name: "F.test",user_password: 'mytest'});
// //    });
 
// //    it("is there is a index method?", () => {
// //      expect(storeUsr.indexAllContent).toBeDefined();
// //    });
 
// //    it("if create can call all users", async () => {
// //      const allUsrs = await storeUsr.indexAllContent();
// //      expect(allUsrs).toContain(userTest);
// //    });
 
// //    it("is there is a show method?", () => {
// //      expect(storeUsr.showOneRow).toBeDefined();
// //    });
 
// //    it("if show can call one user", async () => {
    
// //       const foundOrder = await storeUsr.showOneRow(userTest.id as number);
// //       expect(foundOrder).toEqual({
// //          id: userTest.id, 
// //          first_name: userTest.first_name ,
// //          last_name: userTest.last_name,
// //          user_password: userTest.user_password, 
// //         });
// //     });
   
 
// //    it("is there is a update method?", () => {
// //      expect(storeUsr.update).toBeDefined();
// //    }); 
 
// //     it("if update can update an user", async () => {
// //      const updtedUser = await storeUsr.update({ ...userTest, user_password: "completed" });
// //      expect(updtedUser.user_password).toEqual(hasher("completed"));
// //    }); 
 
// //     it("is there is a delete method?", () => {
// //      expect(storeUsr.delete).toBeDefined();
// //    });
 
// //    it("if delete can delete order", async () => {
// //      const deltdOrdr = await storeUsr.delete(userTest.id as number);
// //      expect(deltdOrdr.id as number).toEqual(userTest.id as number);
// //    });
// //  }); 
 
 
 
 
 
 
 
 
 
 
 
 













// // const store = new User()

// // describe("Users Model", () => {
// //   it('should have an index method', () => {
// //     expect(store.indexAllContent).toBeDefined();
// //   });

// //   it('should have a show method', () => {
// //     expect(store.showOneRow).toBeDefined();
// //   });

// //   it('should have a create method', () => {
// //     expect(store.createRow).toBeDefined();
// //   });

// //  /*  it('should have a update method', () => {
// //     expect(store.index).toBeDefined();
// //   });
// //  */
// //   it('should have a delete method', () => {
// //     expect(store.delete).toBeDefined();
// //   });
// // // 
// //   it('create method should add a user', async () => {

// //     let newOrder:User_type = {
// //     first_name: "tareq",
// //     last_name: "ahmad",
// //     user_password: "im_tareq_123"
// //     }

// //     const result = await store.createRow(newOrder);
// //     expect(result).toEqual({first_name: "tareq",
// //     last_name: "ahmad",
// //     user_password: "im_tareq_123"});
// //   });

// //   it('index method should return a list of users', async () => {
// //     const result = await store.indexAllContent();
// //     expect(result).toEqual([{
// //         first_name: "tareq",
// //     last_name: "ahmad",
// //     user_password: "im_tareq_123"
// //     }]);
// //   });

// //   it('show method should return the correct user', async () => {
// //     const result = await store.showOneRow(1);
// //     expect(result).toEqual({
// //         first_name: "tareq",
// //         last_name: "ahmad",
// //         user_password: "im_tareq_123"
// //     });
// //   });

// //   it('delete method should remove the user', async () => {
// //     store.delete(1);
// //     const result = await store.indexAllContent()

// //     expect(result).toEqual([]);
// //   });
// // });

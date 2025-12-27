
 import { Order, Order_Type } from "../../../models/orders";
import { User } from "../../../models/users";
import { User_type } from "../../../models/users";

const storeOrdr = new Order();
const storeUsr = new User();
// const storeUsr = new UserStore();
const orderRef: Order_Type = {id:1, quantity_in_order: 1,user_id: 1,status_of_order: 'complete'};
let orderTest: Order_Type;

describe("Testing order Model", () => {
	beforeAll(async () => {
		const user = await storeUsr.createRow({ first_name: "tareq", last_name: "ahmad", user_password: "test" });
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
		expect({ id:1,quantity_in_order: 1,user_id: 1,status_of_order: 'complete'}).toEqual({
			id:1,
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
       id: 1, 
       quantity_in_order: 1,
       user_id:1,
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












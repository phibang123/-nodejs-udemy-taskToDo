// CRUD

// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectId;

const { MongoClient, ObjectId } = require("mongodb");

const id = new ObjectId();
console.log(id);
console.log(id.getTimestamp());
console.log(id.toHexString());

const connectionURL = "mongodb://localhost:27017";
const databaseName = "task-manager";

MongoClient.connect(
	connectionURL,
	{
		useNewUrlParser: true,
	},
	(error, client) => {
		if (error) {
			return console.error("Unable connect to database!");
		}

		const db = client.db(databaseName);

		// create
		// db.collection("users").insertOne({
		//   _id: id,
		//   name: "Lý Khôi",
		//   age: "23"
		// }, (error, result) =>
		// {
		//   if (error)
		//   {
		//     console.log("Unable to inser User")
		//   }
		//   console.log(result)
		// })

		// db.collection("users").insertMany([
		//   {
		//     name: "Khoi",
		//     age: 34
		//   },
		//   {
		//     name: "Khang",
		//     age:25
		//   }
		// ], (error, result) =>
		// {
		//   if (error)
		//   {
		//     return console.log("Unable to insert document!");
		//   }
		//   console.log(result)
		// })

		// db.collection("tasks").insertMany(
		// 	[
		// 		{
		// 			description: "Clean the house",
		// 			completed: true,
		// 		},
		// 		{
		// 			description: "Renew inspection",
		// 			completed: true,
		// 		},
		// 		{
		// 			description: "Pot plants",
		// 			completed: true,
		// 		},
		// 	],
		// 	(error, result) => {
		// 		if (error) {
		// 			return console.log("Unable to insert documnet!");
		// 		}
		// 		console.log(result);
		// 	}
		// );

		// find
		// db.collection('users').findOne({_id: new ObjectId("6224b89916564e6615863d5a")}, (error, user) =>
		// {
		//   if (error)
		//   {
		//     return console.log("Unable to fetch!");
		//   }
		//   console.log(user)
		// })

		// db.collection("users").find({ age: 24 }).toArray((error, users) =>
		// {
		//   if (error)
		//   {
		//     return console.log("Unable to fetch!");
		//   }
		//   console.log(users)
		// });

		// //count
		// db.collection("users").find({ age: 34 }).count((error, count) =>
		// {
		//   if (error)
		//   {
		//     return console.log("Unable to fetch!");
		//   }
		//   console.log(count)
		// });

		//update
		//   const updatePromise =  db.collection('users').updateOne({
		//     _id: new ObjectId("6224b794e461aafeda073436")
		//   }, {
		//     // $set: {
		//     //   name: "Lý Bá"
		//     // }

		//     //tăng giảm
		//     $inc: {
		//       age: 1
		//     }
		//   })
		//   updatePromise.then((result) =>
		//   {
		//     console.log(result)
		//   }).catch((error) =>
		//   {
		//     console.log(error)
		//   })
		//   console.log(123)

		//update many
		// db.collection("tasks")
		// 	.updateMany(
		// 		{
		// 			completed: true,
		// 		},
		// 		{
		// 			$set: {
		// 				completed: false,
		// 			},
		// 		}
		// 	)
		// 	.then((result) => {
		// 		console.log(result,"hola");
		// 	})
		// 	.catch((error) => {
		// 		console.log(error,"alo");
    //   });
    
    // console.log(123)

    // db.collection("users").deleteMany({
    //   age: "23"
    // }).then((result) =>
    // {
    //   console.log(result, "correct");
    // }).catch((error) =>
    // {
    //   console.log(error)
    // })
	}
);

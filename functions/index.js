const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendExpiryNotification = functions.pubsub
    .schedule("every 24 hours")
    .onRun(async (context) => {
      const today = new Date();
      const pantryItemsRef = admin.firestore().collection("pantryItems");
      const snapshot = await pantryItemsRef
          .where("expiryDate", "<", new Date(today.setDate(today.getDate() + 3))) 
          .get();

      snapshot.forEach(async (doc) => {
        const pantryItem = doc.data();
        const userId = pantryItem.userId;
        const userRef = admin.firestore().collection("users").doc(userId);
        const userSnapshot = await userRef.get();
        const user = userSnapshot.data();

        if (user.notificationsEnabled) {
          const payload = {
            notification: {
              title: "Expiry Alert",
              body: `Your item "${pantryItem.name}" is nearing its expiry date!`,
              sound: "default",
            },
            token: user.fcmToken, 
          };

          // Send the notification
          await admin.messaging().send(payload);
        }
      });
    });

const admin = require('firebase-admin');
const serviceAccount = require('D://ASE//smartpantry//android//app//smartpantryapp-a524e-firebase-adminsdk-a9gxi-e4aea8cae0.json');  // Specify the path to your service account file

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const pantryItemsRef = db.collection('pantryItems');

// Get the current date
const currentDate = new Date();

async function deleteExpiredItems() {
  try {
    // Query to find expired items (expiryDate <= current date)
    const snapshot = await pantryItemsRef
      .where('expiryDate', '==', null)
      .get();

    if (snapshot.empty) {
      console.log('No expired items found.');
      return;
    }

    // Delete each expired item
    snapshot.forEach(doc => {
      doc.ref.delete();
      console.log(`Deleted expired item: ${doc.id}`);
    });

    console.log('Expired items deleted successfully.');
  } catch (error) {
    console.error('Error deleting expired items:', error);
  }
}

deleteExpiredItems();

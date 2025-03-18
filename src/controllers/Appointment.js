const { getFirestore, collection, addDoc,getDocs, doc,updateDoc, DocumentReference } = require("firebase/firestore");
const db = getFirestore();



class Appointment {
    async Appointment(req, res) {
       
        try {
          const querySnapshot = await getDocs(collection(db, "appointments"));
          const appointments= [];
          querySnapshot.forEach((doc) => {
            appointments.push({ id: doc.id, ...doc.data() });
          });
          res.status(200).json(appointments);
        } catch (error) {
          console.error("error fetching appointment list ", error);
          res.status(500).json({ error: error.message });
        }
      }
    
      // Endpoint to get a list of all patients
      
      
}
module.exports = new Appointment();
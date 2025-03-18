const { getFirestore, collection, addDoc,getDocs, getDoc,doc,updateDoc, DocumentReference } = require("firebase/firestore");
const db = getFirestore();



class GloveAssigner {
    async assignGloveToPatient(req, res) {
        try {
          const { gloveId, patientId } = req.body;
          if (!gloveId || !patientId) {
            return res.status(400).json({ error: "gloveId and patientId required" });
          }
    
          // Update the glove doc to add a reference to the patient
          await updateDoc(doc(db, "Gloves", gloveId), {
            patientID: patientId
          });
          await updateDoc(doc(db,"patients",patientId),{
            gloveId: gloveId
          });
          await updateDoc(doc(db, "Gloves", gloveId), {
            patientID: patientId,
            status: "active"
          });
    
          res.status(200).json({ message: "Glove assigned to patient", gloveId, patientId });
        } catch (error) {
          console.error("Error assigning glove:", error);
          res.status(500).json({ error: error.message });
        }
        
      }
      async getGloves(req, res) {
        try {
          const querySnapshot = await getDocs(collection(db, "Gloves"));
          const gloves = [];
          querySnapshot.forEach((doc) => {
            gloves.push({ id: doc.id, ...doc.data() });
          });
          res.status(200).json(gloves);
        } catch (error) {
          console.error("Error fetching gloves list:", error);
          res.status(500).json({ error: error.message });
        }
      }
    
      // Endpoint to get a list of all patients
      async getPatients(req, res) {
        try {
          const querySnapshot = await getDocs(collection(db, "patients"));
          
          // For each patient, fetch the corresponding user document and merge data.
          const patients = await Promise.all(
            querySnapshot.docs.map(async (patientDoc) => {
              const patientData = patientDoc.data();
              // Assuming the patient document ID corresponds to the user document ID
              const userDocRef = doc(db, "users", patientDoc.id);
              const userDoc = await getDoc(userDocRef);
              const userData = userDoc.exists() ? userDoc.data() : {};
              
              // Merge patient data with the user's name (assuming it's stored as 'fullName' or 'name')
              return {
                id: patientDoc.id,
                ...patientData,
                fullName: userData.fullName || userData.name || "Unnamed Patient"
              };
            })
          );
    
          res.status(200).json(patients);
        } catch (error) {
          console.error("Error fetching patients list:", error);
          res.status(500).json({ error: error.message });
        }
      }
}
module.exports = new GloveAssigner();
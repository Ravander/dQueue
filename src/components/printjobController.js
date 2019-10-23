import firebase from "./firebaseInit";
const db = firebase.firestore();

export default {
  compareDates(a, b) {
    if (a.creationDate < b.creationDate) return -1
    if (a.creationDate > b.creationDate) return 1
    return 0
  },
  getJobs: function(printer, callback) {
    let priorityJobs = [],
      normalJobs = [],
      runningJobs = [],
      doneJobs = [];

    return db.collection("print_jobs").get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const data = {
          "id": doc.id,
          "name": doc.data().name,
          "part": doc.data().part,
          "time": doc.data().print_time,
          "material": doc.data().material,
          "priority": doc.data().priority,
          "printer": doc.data().printer,
          "creationDate": doc.data().creationDate,
          "startedDate": doc.data().startedDate
        };
        if (data.priority === "done") {
          doneJobs.push(data);
        } else if (data.priority === "running") {
          runningJobs.push(data);
        } else if (data.priority === "high") {
          priorityJobs.push(data);
        } else {
          normalJobs.push(data);
        } 
      });

      doneJobs = doneJobs.filter(job => job.printer === printer.name).sort(this.compareDates);
      runningJobs = runningJobs.filter(job => job.printer === printer.name).sort(this.compareDates);
      priorityJobs = priorityJobs.filter(job => job.printer === printer.name).sort(this.compareDates);
      normalJobs = normalJobs.filter(job => job.printer === printer.name).sort(this.compareDates);

      runningJobs.forEach(job => printer.jobs.push(job));
      priorityJobs.forEach(job => printer.jobs.push(job));
      normalJobs.forEach(job => printer.jobs.push(job));
      doneJobs.forEach(job => printer.jobs.push(job));

      callback();
    });
  },
  addJob: function(newJob, callback) {
    db.collection("print_jobs").add({
      name: newJob.name,
      part: newJob.part,
      print_time: newJob.time,
      material: newJob.material,
      priority: newJob.priority,
      printer: newJob.printer,
      creationDate: new Date(),
      startedDate: new Date()
    })
    .then(docRef => callback())
    .catch(err => console.error("Error adding new job: ", err))
  },
  removeJob: function(job, callback) {
    return db.collection("print_jobs").where("part", "==", job.part).where("name", "==", job.name).where("creationDate", "==", job.creationDate).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        doc.ref.delete();
        callback(job);
      });
    });
  },
  editJob: function(job, editedJob, callback) {
    return db.collection("print_jobs").where("part", "==", job.part).where("name", "==", job.name).where("creationDate", "==", job.creationDate).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        doc.ref.update({
          name: editedJob.name,
          part: editedJob.part,
          print_time: editedJob.time,
          material: editedJob.material,
          printer: editedJob.printer,
          priority: editedJob.priority,
          startedDate: new Date()
        });
        callback(job);
      });
    });
  },
  startJob: function(job, callback) {
    return db.collection("print_jobs").where("part", "==", job.part).where("name", "==", job.name).where("creationDate", "==", job.creationDate).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        doc.ref.update({
          priority: "running",
          startedDate: new Date()
        });
        callback(job);
      });
    });
  },
  finishJob: function(job, callback) {
    return db.collection("print_jobs").where("part", "==", job.part).where("name", "==", job.name).where("creationDate", "==", job.creationDate).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        doc.ref.update({
          priority: "done"
        });
        callback();
      });
    });
  }
};
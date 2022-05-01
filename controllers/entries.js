const Entry = require("../models/entry");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_ACCESS_SECRET,
});

module.exports.index = async (req, res) => {
  const entries = await Entry.find({ user: req.user }).sort({ dateExpired: 1 });
  res.render("entries/index", { entries, isAllEntries: true });
};

module.exports.renderNewForm = (req, res) => {
  res.render("entries/new", { isNewEntryForm: true });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const entry = await Entry.findById(id);
  if (!entry) {
    req.flash("error", "Cannot find this warranty!");
    return res.redirect("/entries");
  }
  res.render("entries/edit", { entry });
};

module.exports.createEntry = async (req, res, next) => {
  const entry = new Entry(req.body.entry);
  const dateExpired = req.body.entry.dateExpired;

  const dayAfterTomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2);
  dayAfterTomorrow.setUTCHours(0, 0, 0, 0);
  const period12weeksInMilliseconds = 1000 * 60 * 60 * 24 * 7 * 12;
  let date12weekNotification = new Date(
    Date.parse(dateExpired) - period12weeksInMilliseconds
  );
  // console.log(new Date(), date12weekNotification, dayAfterTomorrow);
  if (date12weekNotification <= dayAfterTomorrow) date12weekNotification = null;
  let date4weekNotification = new Date(
    Date.parse(dateExpired) - period12weeksInMilliseconds / 3
  );
  if (date4weekNotification <= dayAfterTomorrow) date4weekNotification = null;
  let date1weekNotification = new Date(
    Date.parse(dateExpired) - period12weeksInMilliseconds / 12
  );
  if (date1weekNotification <= dayAfterTomorrow) date1weekNotification = null;

  const currentDate = new Date();
  entry.dateCreated = currentDate;
  entry.dateModified = currentDate;
  entry.date12weekNotification = date12weekNotification;
  entry.date4weekNotification = date4weekNotification;
  entry.date1weekNotification = date1weekNotification;
  entry.user = req.user._id;
  entry.status = "Active";
  await entry.save();
  req.flash("success", "Successfully added a new warranty!");
  res.redirect(`/entries/${entry._id}`);
};

module.exports.showEntry = async (req, res) => {
  const entry = await Entry.findById(req.params.id);
  if (!entry) {
    req.flash("error", "Cannot find this warranty!");
    return res.redirect("/entries");
  }
  res.render("entries/show", { entry });
};

module.exports.deleteEntry = async (req, res) => {
  const { id } = req.params;
  const entry = await Entry.findById(id);
  if (entry.files.length) {
    const deleteParam = {
      Bucket: process.env.S3_BUCKET || "track-my-warranties-dev",
      Delete: {
        Objects: [],
      },
    };
    for (let file of entry.files) {
      deleteParam.Delete.Objects.push({ Key: file.storedFileName });
    }
    await s3.deleteObjects(deleteParam).promise();
  }
  await Entry.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted warranty!");
  res.redirect("/entries");
};

module.exports.updateEntry = async (req, res) => {
  const { id } = req.params;
  const dateExpired = req.body.entry.dateExpired;
  const dayAfterTomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2);
  dayAfterTomorrow.setUTCHours(0, 0, 0, 0);
  const period12weeksInMilliseconds = 1000 * 60 * 60 * 24 * 7 * 12;
  let date12weekNotification = new Date(
    Date.parse(dateExpired) - period12weeksInMilliseconds
  );
  // console.log(new Date(), date12weekNotification, dayAfterTomorrow);
  if (date12weekNotification <= dayAfterTomorrow) date12weekNotification = null;
  let date4weekNotification = new Date(
    Date.parse(dateExpired) - period12weeksInMilliseconds / 3
  );
  if (date4weekNotification <= dayAfterTomorrow) date4weekNotification = null;
  let date1weekNotification = new Date(
    Date.parse(dateExpired) - period12weeksInMilliseconds / 12
  );
  if (date1weekNotification <= dayAfterTomorrow) date1weekNotification = null;
  const entry = await Entry.findByIdAndUpdate(id, {
    ...req.body.entry,
    date12weekNotification,
    date4weekNotification,
    date1weekNotification,
    dateModified: new Date(),
  });
  req.flash("success", "Successfully updated warranty!");
  res.redirect(`/entries/${entry._id}`);
};

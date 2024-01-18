// User, Kecelakaan, Wisatawan, Cuaca, Clustering, ClusteringResult
const { User, Cuaca, Wisatawan, Kecelakaan } = require('./../models');
const catchAsync = require('./../utils/catchAsync');

//**************************** STATIC FUNCTIONS ******************************** */
const _getEarliestLatestDate = (obj) => {
  // Get the earliest date
  const earliestDate = obj.reduce((earliest, current) => {
    return earliest.tanggal < current.tanggal ? earliest : current;
  }, obj[0]);

  // Get the latest date
  const latestDate = obj.reduce((latest, current) => {
    return latest.tanggal > current.tanggal ? latest : current;
  }, obj[0]);

  return [earliestDate.tanggal, latestDate.tanggal];
};

const _formatDate = (inputDate) => {
  // Parse the input date string
  const dateObject = new Date(inputDate);

  // Get month and year
  const month = dateObject.toLocaleString('id-ID', { month: 'short' });
  const year = dateObject.getFullYear();

  // Format the date
  const formattedDate = `${month} ${year}`;

  return formattedDate;
};

const _formatDateTable = (inputDate) => {
  const options = { dateStyle: 'medium', timeStyle: 'medium', timeZone: 'Asia/Makassar' };
  return new Intl.DateTimeFormat('id-ID', options).format(inputDate);
};

const _getDashboardData = async (userId, Model) => {
  const resultQuery = await Model.findAll({
    where: {
      user_id: userId,
    },
  });

  if (!resultQuery.length) {
    return {
      count: 0,
      min_date: '',
      max_date: '',
    };
  }

  const resultQueryArr = resultQuery.map((instance) => instance.dataValues);
  const [earliestDate, latestDate] = _getEarliestLatestDate(resultQueryArr);

  return {
    count: resultQueryArr.length,
    min_date: _formatDate(earliestDate),
    max_date: _formatDate(latestDate),
  };
};

const _getDatasetData = async (userId, Model) => {
  const resultQuery = await Model.findAll({
    where: {
      user_id: userId,
    },
    order: [['tanggal', 'ASC']],
  });
  const resultObj = resultQuery.map((el) => el.dataValues);
  return resultObj;
};

//**************************** EXPORTED FUNCTIONS ******************************** */
exports.getHomePage = (req, res) => {
  res.redirect('/dashboard');
};

exports.getBlankPage = (req, res) => {
  res.status(200).render('blank', {
    title: 'Blank Page',
    bread_crumbs: ['Blank'],
  });
};

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login',
  });
};

exports.getDashboardPage = catchAsync(async (req, res, next) => {
  const userId = res.locals.local_user.id;

  const cuaca = await _getDashboardData(userId, Cuaca);
  const wisatawan = await _getDashboardData(userId, Wisatawan);
  const kecelakaan = await _getDashboardData(userId, Kecelakaan);
  const user = {};
  user.count = (
    await User.findAndCountAll({
      where: {
        role: 'user',
      },
    })
  ).count;

  res.status(200).render('dashboard', {
    title: 'Dashboard',
    bread_crumbs: ['Dashboard'],
    cuaca,
    wisatawan,
    kecelakaan,
    user,
  });
});

exports.getManageUserPage = catchAsync(async (req, res, next) => {
  const resultQuery = await User.findAll({
    where: {
      role: 'user',
    },
  });
  const users = resultQuery.map((el) => el.dataValues);

  users.forEach((user) => {
    user.createdAt = _formatDateTable(user.createdAt);
    user.updatedAt = _formatDateTable(user.updatedAt);
    delete user.password;
    delete user.role;
  });

  res.status(200).render('manage-user', {
    title: 'Manage Data User',
    bread_crumbs: ['Manage Data User'],
    users,
  });
});

exports.getKecelakaanPage = catchAsync(async (req, res, next) => {
  const userId = res.locals.local_user.id;
  const kecelakaan = await _getDatasetData(userId, Kecelakaan);

  kecelakaan.forEach((item) => {
    item.tanggal = _formatDate(item.tanggal);
    item.createdAt = _formatDateTable(item.createdAt);
    item.updatedAt = _formatDateTable(item.updatedAt);
  });

  res.status(200).render('kecelakaan', {
    title: 'Manage Data Kecelakaan',
    bread_crumbs: ['Manage Dataset', 'Kecelakaan'],
    kecelakaan,
    modelName: 'kecelakaan',
  });
});

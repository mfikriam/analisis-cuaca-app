const { User, Cuaca, Wisatawan, Kecelakaan, Clustering, ClusteringResult } = require('./../models');
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

const _getDataset = async (userId, Model) => {
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
  if (res.locals.local_user.role !== 'admin') return res.redirect('/dashboard');

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
    modelName: 'user',
  });
});

exports.getKecelakaanPage = catchAsync(async (req, res, next) => {
  const userId = res.locals.local_user.id;
  const kecelakaan = await _getDataset(userId, Kecelakaan);

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

exports.getWisatawanPage = catchAsync(async (req, res, next) => {
  const userId = res.locals.local_user.id;
  const wisatawan = await _getDataset(userId, Wisatawan);

  wisatawan.forEach((item) => {
    item.tanggal = _formatDate(item.tanggal);
    item.createdAt = _formatDateTable(item.createdAt);
    item.updatedAt = _formatDateTable(item.updatedAt);
  });

  res.status(200).render('wisatawan', {
    title: 'Manage Data Wisatawan',
    bread_crumbs: ['Manage Dataset', 'Wisatawan'],
    wisatawan,
    modelName: 'wisatawan',
  });
});

exports.getCuacaPage = catchAsync(async (req, res, next) => {
  const userId = res.locals.local_user.id;
  const cuaca = await _getDataset(userId, Cuaca);

  cuaca.forEach((item) => {
    item.tanggal = _formatDate(item.tanggal);
    item.createdAt = _formatDateTable(item.createdAt);
    item.updatedAt = _formatDateTable(item.updatedAt);
  });

  res.status(200).render('cuaca', {
    title: 'Manage Data Cuaca',
    bread_crumbs: ['Manage Dataset', 'Cuaca'],
    cuaca,
    modelName: 'cuaca',
  });
});

exports.getClusteringPage = catchAsync(async (req, res) => {
  const userId = res.locals.local_user.id;
  let clustering;
  let clusteringResultList = [];

  clustering = await Clustering.findOne({
    where: {
      user_id: userId,
    },
  });

  if (clustering) {
    clustering = clustering.toJSON();
    const clusteringResultQuery = await ClusteringResult.findAll({
      where: {
        clustering_id: clustering.id,
      },
    });

    clusteringResultList = clusteringResultQuery.map((el) => el.dataValues);

    clusteringResultList = await Promise.all(
      clusteringResultList.map(async (el, index) => {
        el.cuaca = (await clusteringResultQuery[index].getCuaca()).toJSON();
        el.cuaca.tanggal = _formatDate(el.cuaca.tanggal);
        return el;
      }),
    );
  }

  res.status(200).render('clustering', {
    title: 'Clustering',
    bread_crumbs: ['Clustering'],
    clustering,
    clustering_result: clusteringResultList,
  });
});

exports.getAnalisisPage = catchAsync(async (req, res) => {
  const userId = res.locals.local_user.id;

  //? Data Cuaca
  const cuaca = await _getDataset(userId, Cuaca);
  cuaca.forEach((item) => {
    item.tanggal = _formatDate(item.tanggal);
    delete item.id;
    delete item.createdAt;
    delete item.updatedAt;
    delete item.user_id;
    delete item.userId;
  });

  //? Data Wisatawan
  const wisatawan = await _getDataset(userId, Wisatawan);
  wisatawan.forEach((item) => {
    item.tanggal = _formatDate(item.tanggal);
    delete item.id;
    delete item.createdAt;
    delete item.updatedAt;
    delete item.user_id;
    delete item.userId;
  });

  //? Data Kecelakaan
  const kecelakaan = await _getDataset(userId, Kecelakaan);
  kecelakaan.forEach((item) => {
    item.tanggal = _formatDate(item.tanggal);
    delete item.id;
    delete item.createdAt;
    delete item.updatedAt;
    delete item.user_id;
    delete item.userId;
  });

  //? Data Clustering Result
  let clustering;
  let clusteringResultList;
  let clusteringResult = [];

  clustering = await Clustering.findOne({
    where: {
      user_id: userId,
    },
  });

  if (clustering) {
    clustering = clustering.toJSON();
    const clusteringResultQuery = await ClusteringResult.findAll({
      where: {
        clustering_id: clustering.id,
      },
    });

    clusteringResultList = clusteringResultQuery.map((el) => el.dataValues);
    clusteringResultList = await Promise.all(
      clusteringResultList.map(async (el, index) => {
        el.cuaca = (await clusteringResultQuery[index].getCuaca()).toJSON();
        el.cuaca.tanggal = _formatDate(el.cuaca.tanggal);
        return el;
      }),
    );

    clusteringResult = clusteringResultList.map((el) => {
      return {
        tanggal: el.cuaca.tanggal,
        cluster: el.cluster,
      };
    });
  }

  res.status(200).render('analisis', {
    title: 'Analisis',
    bread_crumbs: ['Analisis'],
    cuaca,
    wisatawan,
    kecelakaan,
    clustering,
    clustering_result: clusteringResult,
  });
});

// import { hashHmacString } from '../Common/helper.mjs';
// import AdminRepository from '../Repositories/AdminRepository.mjs';

// class AdminService {
//     constructor() {
//         this.adminRepository = new AdminRepository();
//     }

//     index() {
//         return this.adminRepository.find({});
//     }

//     async storeUser(params) {
//         params.password = hashHmacString(params.password);
//         return await this.adminRepository.store(params);
//     }

//     show(adminId) {
//         return this.adminRepository.findById(adminId);
//     }

//     update(adminId, params, authUser) {
//         return this.adminRepository.update(adminId, params, authUser);
//     }

//     destroy(adminId) {
//         return this.adminRepository.delete(adminId);
//     }
// }

// export default AdminService;

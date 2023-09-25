import { PAGINATE_OPTIONS } from '../../config/common.mjs';
class BaseRepository {
    model = null;

    constructor(model) {
        this.setModel(model);
    }

    getModel() {
        return this.model;
    }

    setModel(model) {
        this.model = model;
    }

    store(data) {
        return this.getModel().create(data);
    }
    findOne(conditions = {}, sort = {}) {
        return this.getModel().findOne(conditions).sort(sort);
    }
    findBy(conditions = {}, sort = {}) {
        return this.getModel()
            .find({ ...conditions, deleted_at: null })
            .sort(sort);
    }

    findById(id) {
        return this.getModel().findOne({
            _id: id,
            deleted_at: null,
        });
    }

    update(id, data) {
        return this.getModel().findByIdAndUpdate(id, data);
    }

    delete(id) {
        return this.getModel().findByIdAndDelete(id, {
            deleted_at: new Date(),
        });
    }
    count(options = {}) {
        return this.getModel().count(options);
    }
    paginate(conditions = {}, options = {}) {
        if (typeof options.sort !== 'object') {
            options.sort = PAGINATE_OPTIONS.sort;
        }

        if (!options.page || options.page < 1) {
            options.page = PAGINATE_OPTIONS.page;
        }

        if (!options.limit || options.limit < 0) {
            options.limit = PAGINATE_OPTIONS.limit;
        }
        delete conditions.pagination;

        return this.getModel().paginate(
            { ...conditions, deleted_at: null },
            options
        );
    }
}

export default BaseRepository;

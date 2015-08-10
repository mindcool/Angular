'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Job = mongoose.model('Job'),
	_ = require('lodash');

/**
 * Create a job
 */
exports.create = function(req, res) {
	var job = new Job(req.body);
	job.user = req.user;

	job.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(job);
		}
	});
};

/**
 * Show the current job
 */
exports.read = function(req, res) {
	res.json(req.job);
};

/**
 * Update a job
 */
exports.update = function(req, res) {
	var job = req.job;

	job = _.extend(job, req.body);

	job.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(job);
		}
	});
};

/**
 * Delete an job
 */
exports.delete = function(req, res) {
	var job = req.job;

	job.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(job);
		}
	});
};

/**
 * List of jobs
 */
exports.list = function(req, res) {
	Job.find().sort('-created').populate('user', 'displayName').exec(function(err, jobs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(jobs);
		}
	});
};

/**
 * job middleware
 */
exports.jobByID = function(req, res, next, id) {
	Job.findById(id).populate('user', 'displayName').exec(function(err, job) {
		if (err) return next(err);
		if (!job) return next(new Error('Failed to load job ' + id));
		req.job = job;
		next();
	});
};

/**
 * job authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.job.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
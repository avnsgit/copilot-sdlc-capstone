class PipelineError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = this.constructor.name;
    this.code = options.code || 'PIPELINE_ERROR';
    this.cause = options.cause;
    this.fatal = options.fatal !== false;
  }
}

class ConfigError extends PipelineError {
  constructor(message, options = {}) {
    super(message, { ...options, code: options.code || 'CONFIG_ERROR' });
  }
}

class RemoteError extends PipelineError {
  constructor(message, options = {}) {
    super(message, { ...options, code: options.code || 'REMOTE_ERROR' });
    this.status = options.status;
    this.retryable = Boolean(options.retryable);
    this.endpoint = options.endpoint;
    this.responseBody = options.responseBody;
  }
}

module.exports = {
  PipelineError,
  ConfigError,
  RemoteError,
};
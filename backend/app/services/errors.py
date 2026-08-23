class ServiceError(Exception):
    pass


class CaseNotFoundError(ServiceError):
    pass


class InvalidCaseStateError(ServiceError):
    pass


class ConsentRequiredError(ServiceError):
    pass


class IdentificationRequiredError(ServiceError):
    pass


class InvalidUploadError(ServiceError):
    pass

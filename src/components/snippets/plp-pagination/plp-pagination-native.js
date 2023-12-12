import Icon from 'snippets/icon/icon'

function PlpPaginationNav({ isLoading, pagination, goToPage }) {
  const translate = window.plpState.translates

  if (isLoading) {
    return (
      <div className="skeleton mt-6 animate-pulse lg:mt-10 lg:pb-12">
        <div className="flex items-center justify-center">
          {[...Array(6)].map(() => (
            <div className="mx-2 h-10 w-10 bg-[linear-gradient(270deg,#F9FAFB_18.75%,#E5E7EB_179.69%)]"></div>
          ))}
        </div>
      </div>
    )
  }
  return (
    pagination &&
    pagination.pages.length > 1 && (
      <div className="mt-6 flex flex-col items-center justify-center pb-6 lg:mt-10 lg:pb-12">
        <nav className="isolate flex items-center -space-x-px" aria-label="Pagination">
          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-l-md border border-default text-sm focus:z-20 disabled:text-grey-400"
            disabled={pagination.currentPage === 1}
            onClick={() => goToPage([pagination.currentPage - 1])}
          >
            <span className="sr-only">{translate.previousPagination}</span>
            <Icon viewBox="0 0 20 20" name="icon-chevron-left" className="h-4 w-4" />
          </button>
          {pagination.pages.map((page) => (
            <button
              className={`relative flex h-10 w-10 items-center justify-center border p-3 text-base font-medium focus:z-20
                ${
                  page === pagination.currentPage
                    ? 'z-10 border-primary bg-primary text-white'
                    : 'border-default bg-white text-gray-900 hover:border-primary hover:bg-primary hover:text-white'
                }
                ${page === '...' ? 'pointer-events-none' : ''}
              `}
              onClick={() => goToPage([page])}
            >
              {page}
            </button>
          ))}
          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-r-md border border-default text-sm focus:z-20 disabled:text-grey-400"
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => goToPage([pagination.currentPage + 1])}
          >
            <span className="sr-only">{translate.nextPagination}</span>
            <Icon viewBox="0 0 20 20" name="icon-chevron-right" className="h-4 w-4" />
          </button>
        </nav>
      </div>
    )
  )
}

export default PlpPaginationNav

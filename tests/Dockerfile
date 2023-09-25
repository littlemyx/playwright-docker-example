FROM mcr.microsoft.com/playwright:v1.36.2-focal

RUN npx playwright install

# Create the entrypoint script
# We need it because of the quirks of how Docker works with its input
# and the necessity of passing different arg to Playwright in different cases.
# It is included inside of Docker for the purpose of keep all the separated logic together.
RUN echo '#!/bin/bash' > /entrypoint.sh && \
    echo 'xvfb-run -- npx playwright test "$@"' >> /entrypoint.sh && \
  # echo 'xvfb-run -a --server-args="-screen 0 1280x800x24 -ac -nolisten tcp -dpi 96 +extension RANDR" npx playwright test tests --reporter=list --workers 1 ' >> /entrypoint.sh && \
  chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

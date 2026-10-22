# MCP implementation decision

Status: **Out of project scope; no MCP server implemented.**

## Repository evidence

- The product is a public portfolio, not an agent platform.
- The existing assistant endpoints support the portfolio UI; they are not approved third-party operations.
- There is no OAuth authorization server, protected-resource metadata, scope model, tenant model, audit store or product-approved set of consequential tools.
- No repository requirement identifies an external MCP client or legitimate agent-facing workflow.

## Security rationale

Adding `/mcp`, tool discovery or `/.well-known/oauth-protected-resource` would expose a new integration surface without an authorization foundation. A manifest alone would not be an MCP implementation and could incorrectly suggest supported capabilities.

## Requirements for reconsideration

Future work requires a product decision defining the client, user value, exact read/write operations, data classification, authorization server, scopes, token validation, rate limiting, audit retention, abuse controls and confirmation requirements. Only then should current MCP transport and authorization specifications be evaluated and implemented.

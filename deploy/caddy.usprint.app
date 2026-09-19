# Caddy site — same pattern as akproduction.net on 178.156.164.148
# DNS must be grey-cloud A records to that IP, or Let's Encrypt will fail.

usprint.app {
	redir https://www.usprint.app{uri} permanent
}

www.usprint.app {
	encode gzip
	reverse_proxy 127.0.0.1:43147
}

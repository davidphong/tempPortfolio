#!/bin/bash
# wait-for-mysql.sh

set -e

host="$1"
port="$2"
shift 2
cmd="$@"

echo "Waiting for MySQL to be available at $host:$port..."
until mysqladmin ping -h "$host" -P "$port" --silent; do
  >&2 echo "MySQL is unavailable - sleeping"
  sleep 3
done

>&2 echo "MySQL is up - executing command"
exec $cmd 
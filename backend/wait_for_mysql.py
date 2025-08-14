#!/usr/bin/env python3
"""
Wait for MySQL to be available before starting the application
"""
import sys
import time
import subprocess
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def wait_for_mysql(host, port, max_retries=30, retry_interval=3):
    """Wait for MySQL to be available"""
    logger.info(f"Waiting for MySQL to be available at {host}:{port}...")
    
    retries = 0
    while retries < max_retries:
        try:
            # Use mysqladmin ping to check if MySQL is ready
            cmd = ['mysqladmin', 'ping', '-h', host, '-P', str(port), '--silent']
            result = subprocess.run(cmd, capture_output=True, timeout=10)
            
            if result.returncode == 0:
                logger.info("✅ MySQL is up - ready to start application")
                return True
                
        except subprocess.TimeoutExpired:
            logger.warning("⏱️ MySQL ping timeout")
        except Exception as e:
            logger.warning(f"⚠️ MySQL check failed: {str(e)}")
        
        retries += 1
        logger.info(f"🔄 MySQL is unavailable - attempt {retries}/{max_retries}, sleeping {retry_interval}s...")
        time.sleep(retry_interval)
    
    logger.error(f"❌ MySQL not available after {max_retries} attempts")
    return False

def main():
    if len(sys.argv) < 4:
        logger.error("Usage: python wait_for_mysql.py <host> <port> <command> [args...]")
        sys.exit(1)
    
    host = sys.argv[1]
    port = int(sys.argv[2])
    command = sys.argv[3:]
    
    # Wait for MySQL
    if not wait_for_mysql(host, port):
        sys.exit(1)
    
    # Execute the command
    logger.info(f"🚀 Starting application: {' '.join(command)}")
    try:
        subprocess.run(command, check=True)
    except subprocess.CalledProcessError as e:
        logger.error(f"❌ Application failed to start: {e}")
        sys.exit(e.returncode)

if __name__ == "__main__":
    main()

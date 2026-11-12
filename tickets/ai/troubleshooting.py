TROUBLESHOOTING_STEPS = {
    "NETWORK": [
        "Check whether WiFi or network cable is connected.",
        "Restart the network adapter.",
        "Disconnect and reconnect to the office network.",
        "Check whether other devices can access the network.",
        "Restart the device if the issue continues.",
    ],

    "EMAIL": [
        "Check whether the internet connection is working.",
        "Verify the email address and account settings.",
        "Check the mailbox storage limit.",
        "Restart the email application.",
        "Try accessing email through the web browser.",
    ],

    "HARDWARE": [
        "Check the device power connection.",
        "Verify that all cables are connected properly.",
        "Restart the device if it is safe to do so.",
        "Check whether the hardware is detected by the system.",
        "Contact the hardware support team if the issue continues.",
    ],

    "SOFTWARE": [
        "Restart the affected application.",
        "Check whether the application has pending updates.",
        "Verify that the required system resources are available.",
        "Check whether the issue occurs after restarting the application.",
        "Contact the software support team if the issue continues.",
    ],

    "LOGIN": [
        "Verify the username entered during login.",
        "Check whether Caps Lock is enabled.",
        "Verify that the account is not locked.",
        "Use the official password reset process if needed.",
        "Contact the support team if authentication still fails.",
    ],

    "ACCESS": [
        "Verify that the correct company account is being used.",
        "Check whether the requested resource is available.",
        "Verify the existing access permissions.",
        "Submit an access request through the approved process.",
        "Contact the system administrator for approval.",
    ],

    "OTHER": [
        "Restart the affected application or device if safe.",
        "Record the exact error message.",
        "Note when the issue started.",
        "Check whether the issue affects other users.",
        "Contact the IT support team for further investigation.",
    ],
}


def get_troubleshooting_steps(category):
    return TROUBLESHOOTING_STEPS.get(
        category,
        TROUBLESHOOTING_STEPS["OTHER"]
    )
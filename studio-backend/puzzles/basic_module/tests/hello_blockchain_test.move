#[test_only]
module hello_blockchain::message_tests {

    use hello_blockchain::message;

    #[test]
    public fun test_hello() {
        let msg = message::hello();
        assert!(msg == 1, 78);
    }

    #[test]
    public fun test_bye() {
        let msg = message::bye();
        assert!(msg == 2, 78);
    }
}
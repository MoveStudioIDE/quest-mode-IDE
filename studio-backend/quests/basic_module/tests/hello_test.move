#[test_only]
module hello_blockchain::hello_tests {

    use hello_blockchain::message;

    #[test]
    public fun test_hello() {
        let msg = message::hello();
        assert!(msg == 1, 78);
    }

}